const router = require('express').Router();

//SQL code
const mysql = require('mysql');
const mysqlHost = process.env.MYSQL_HOST;
const mysqlPort = process.env.MYSQL_PORT || '3306';
const mysqlDB = process.env.MYSQL_DATABASE;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;

const maxMySQLConnections = 10;
const mysqlPool = mysql.createPool({
  connectionLimit: maxMySQLConnections,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDB,
  user: mysqlUser,
  password: mysqlPassword
});

const spellSchema = {
  ownerID: { required: false },
  name: { required: true },
  cost: { required: true },
  damage: { required: false },
  school: { required: false },
};

function getSpellsCount() {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT COUNT(*) AS count FROM spell',
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count);
        }
      }
    );
  });
}

function getSpellsPage(page, count) {
  return new Promise((resolve, reject) => {
    const numPerPage = 10;
    const lastPage = Math.ceil(count / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    const offset = (page - 1) * numPerPage;
    mysqlPool.query(
      'SELECT * FROM spell ORDER BY id LIMIT ?,?',
      [ offset, numPerPage ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve({
            spell: results,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: numPerPage,
            totalCount: count
          });
        }
      }
    );
  });
}

router.get('/', function (req, res) {

  getSpellsCount()
    .then((count) => {
      return getSpellsPage(parseInt(req.query.page) || 1, count);
    })
    .then((spellInfo) => {
      spellInfo.links = {};
      let { links, totalPages, pageNumber } = spellInfo;
      if (pageNumber < totalPages) {
        links.nextPage = '/spells?page=' + (pageNumber + 1);
        links.lastPage = '/spells?page=' + totalPages;
      }
      if (pageNumber > 1) {
        links.prevPage = '/spells?page=' + (pageNumber - 1);
        links.firstPage = '/spells?page=1';
      }
      res.status(200).json(spellInfo);
    })
    .catch((err) => {
	  console.error(err);
      res.status(500).json({
        error: "Error fetching spell list."
      });
    });
});

function getSpellByID(spellID) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM spell WHERE id = ?',
      [ spellID ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    )
  });
}

router.get('/:spellID', function (req, res, next) {
  const spellID = parseInt(req.params.spellID);
  
  getSpellByID(spellID)
    .then((spell) => {
      if (spell) {
        res.status(200).json(spell);
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Error fetching spell."
      });
    });
});

function insertNewSpell(spell) {
  return new Promise((resolve, reject) => {
    const spellValues = {
      id: null,
      owner_id: spell.ownerID,
      name: spell.name,
	  cost: spell.cost,
	  damage: spell.damage,
	  school: spell.school
    };
    mysqlPool.query(
      'INSERT INTO spell SET ?',
      spellValues,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}

//	POST
router.post('/', function (req, res, next) {
  if (validation.validateAgainstSchema(req.body, spellSchema)) {
    let spell = validation.extractValidFields(req.body, spellSchema);
	//check if spell already exists ? TODO
    insertNewspell(spell)
	 .then((id) => {
		res.status(201).json({
		id: id,
		links: {
			spell: `/spells/${spell.id}`
		}
		});
	 })
	 .catch((err) => {
		 console.error(err);
		 res.status(500).json({
			error: "Error inserting spell." 
		 });
	 });
    
  } else {
    res.status(400).json({
      error: "Request body is not a valid spell object"
    });
  }
});

function replaceSpellByID(spellID, spell, mysqlPool) {
  return new Promise((resolve, reject) => {
    spell = validation.extractValidFields(spell, spellSchema);
    mysqlPool.query('UPDATE spell SET ? WHERE id = ?', [ spell, spellID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });
}

router.put('/:spellID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const spellID = parseInt(req.params.spellID);
  //check for ownership TODO
  if (validation.validateAgainstSchema(req.body, spellSchema)) {
    replaceSpellByID(spellID, req.body, mysqlPool)
      .then((updateSuccessful) => {
        if (updateSuccessful) {
          res.status(200).json({
            links: {
              spell: `/spells/${spellID}`
            }
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "Unable to update specified spell.  Please try again later."
        });
      });
  } else {
    res.status(400).json({
      error: "Request body is not a valid spell object"
    });
  }
});

function deleteSpellByID(spellID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('DELETE FROM spell WHERE id = ?', [ spellID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });

}

router.delete('/:spellID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const spellID = parseInt(req.params.spellID);
  //check for ownership  TODO
  deleteSpellByID(spellID, mysqlPool)
    .then((deleteSuccessful) => {
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to delete spell.  Please try again later."
      });
    });
});

exports.router = router;
