const router = require('express').Router();

const validation = require('../lib/validation');
const mysql = require('mysql');


const characterSchema = {
  name: { required: true },
  playerid: { required: true },
  class: { required: true },
  strength: { required: true },
  dexterity: { required: true },
  constitution: { required: true },
  intelligence: { required: true },
  wisdom: { required: true },
  charisma: { required: true },
  age: { required: false },
  gender: { required: false },
  experience: { required: false },
  headSlot: { required: false },
  chestSlot: { required: false },
  bootSlot: { required: false },
  spellSlot1: { required: false },
  spellSlot2: { required: false }
};

function getCharacterCount(mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT COUNT(*) AS count FROM characters', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count);
      }
    });
  });
}

function getCharacterPage(page, totalCount, mysqlPool) {
  return new Promise((resolve, reject) => {
    const numPerPage = 10;
    const lastPage = Math.max(Math.ceil(totalCount / numPerPage), 1);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    const offset = (page - 1) * numPerPage;

    mysqlPool.query(
      'SELECT * FROM characters ORDER BY id LIMIT ?,?',
      [ offset, numPerPage ],
      function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve({
            characters: results,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: numPerPage,
            totalCount: totalCount
          });
        }
      }
    );
  });
}

router.get('/', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  getCharacterCount(mysqlPool)
    .then((count) => {
      return getCharacterPage(parseInt(req.query.page) || 1, count, mysqlPool);
    })
    .then((characterPageInfo) => {
      characterPageInfo.links = {};
      let { links, pageNumber, totalPages } = characterPageInfo;
      if (pageNumber < totalPages) {
        links.nextPage = `/characters?page=${pageNumber + 1}`;
        links.lastPage = `/characters?page=${totalPages}`;
      }
      if (pageNumber > 1) {
        links.prevPage = `/characters?page=${pageNumber - 1}`;
        links.firstPage = '/characters?page=1';
      }
      res.status(200).json(characterPageInfo);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Error fetching character list. Please try again later."
      });
    });
});

function getCharacterByID(characterID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM characters WHERE id = ?', [ characterID ], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

router.get('/:characterID', function(req, res){
    const mysqlPool = req.app.locals.mysqlPool;
    const characterID = parseInt(req.params.characterID);
    getCharacterByID(characterID, mysqlPool)
      .then((character) => {
        if (character) {
          res.status(200).json(character);
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "Unable to fetch character. Please try again later."
        });
      });
});

function insertNewCharacter(character, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'INSERT INTO characters SET ?',
      characters,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}

function checkIfItemExists(itemID, mysqlPool) {
  return new Promise((resolve, reject) => {
    if (itemID == null) {
      Promise.resolve(true);
    }
    mysqlPool.query(
      'SELECT * FROM items WHERE id = ?',
      [ itemID ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count > 0);
        }
      }
    )
  });
}

router.post('/', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  if (validation.validateAgainstSchema(req.body, characterSchema)) {
    character = validation.extractValidFields(character, characterSchema);
    character.id = null;
    getPlayerByID(req.body.playerid, mysqlPool)
      .then((player) => {
        if (player) {
          return getPlayerByID(req.body.playerid, mysqlPool);
        } else {
          return Promise.reject(400);
        }
      })
      .then((headSlot) => {
        if (item) {
          return checkIfItemExists(req.body.chestSlot, mysqlPool);
        } else {
          return Promise.reject("headSlot");
        }
      })
      .then((chestSlot) => {
        if (chestSlot) {
          return checkIfItemExists(req.body.bootSlot, mysqlPool);
        } else {
          Promise.reject("chestSlot");
        }
      })
      .then((bootSlot) => {
        if (bootSlot) {
          return checkIfSpellExists(req.body.spellSlot1, mysqlPool);
        } else {
          Promise.reject("bootSlot");
        }
      })
      .then((spellSlot1) => {
        if (spellSlot1) {
          return checkIfSpellExists(req.body.spellSlot2, mysqlPool);
        } else {
          Promise.reject("spellSlot1");
        }
      })
      .then((spellSlot2) => {
        if (spellSlot2) {
          return insertNewCharacter(req.body, mysqlPool);
        } else {
          Promise.reject("spellSlot2");
        }
      })
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            character: `/character/${id}`
          }
        });
      })
      .catch((err) => {
        console.log(err);
        if (err == "headSlot") {
          res.status(400).json({
            error: `headSlot item does not exist: ${req.body.headSlot}`
          });
        } else if (err == "chestSlot") {
          res.status(400).json({
            error: `chestSlot item does not exist: ${req.body.chestSlot}`
          });
        } else if (err == "bootSlot") {
          res.status(400).json({
            error: `bootSlot item does not exist: ${req.body.bootSlot}`
          });
        } else if (err == "spellSlot1") {
          res.status(400).json({
            error: `spellSlot1 item does not exist: ${req.body.spellSlot1}`
          });
        } else if (err == "spellSlot2") {
          res.status(400).json({
            error: `spellSlot2 item does not exist: ${req.body.spellSlot2}`
          });
        } else if (err == 400) {
          res.status(400).json({
            error: `Invalid player ID: ${req.body.playerid}.`
          });
        } else {
          res.status(500).json({
            error: "Error inserting character into DB. Please try again later"
          });
        }
      });
  } else {
    res.status(400).json({
      error: "Request body is not a valid character object."
    });
  }
});

function replaceCharacterByID(charcterID, character, mysqlPool) {
  return new Promise((resolve, reject) => {
    charcter = validation.extractValidFields(character, characterSchema);
    mysqlPool.query('UPDATE characters SET ? WHERE id = ?', [ character, characterID ], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });
}

router.put('/:characterID', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  const characterID = parseInt(req.params.characterID);
  if (validation.validateAgainstSchema(req.body, characterID)) {
    replaceCharacterByID(characterID, req.body, mysqlPool)
      .then((updateSuccessful) => {
        if (updateSuccessful) {
          res.status(200).json({
            links: {
              character: `/characters/${characterID}`
            }
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "Unable to update character, please try again later"
        });
      });
  } else {
    res.status(400).json({
      error: "Request body is not a valid character object"
    });
  }
});

function deleteCharacterByID(characterID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('DELETE FROM characters WHERE id = ?', [ characterID ], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });
}

router.delete('/:characterID', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  const characterID = parseInt(req.params.characterID);
  deleteCharacterByID(characterID, mysqlPool)
    .then((deleteSuccessful) => {
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to delete character. Please try again later."
      });
    });
});

function getCharactersByPlayerID(playerID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM characters WHERE playerid = ?',
      [ playerID ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}

exports.router = router;
exports.getCharactersByPlayerID = getCharactersByPlayerID;
