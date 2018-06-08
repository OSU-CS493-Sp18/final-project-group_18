const router = require('express').Router();
const mysql = require('mysql');


const mysqlHost = process.env.MYSQL_HOST;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const mysqlUser = process.env.MYSQL_USER;
const mysqlDB = process.env.MYSQL_DATABASE;
const mysqlPort = process.env.MYSQL_PORT || '3306';

console.log("== MYSQL_HOST:", mysqlHost);

const maxMySQLConnections = 10;
const mysqlPool = mysql.createPool({
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDB,
  user: mysqlUser,
  password: mysqlPassword,
  connectionLimit: maxMySQLConnections
});

let items = require('./items');

exports.router = router;
exports.items = items;

const itemSchema = {
    playerID: {require: true},
    name: {require: true},
    price: {require: true},
    location: {require: true},
    rarity: {require: true}
};

/*
* Gets a paginated list of items in the game.
*/
function getItemPage(mysqlPool, page, count) {
    return new Promise((resolve, reject) => {
      const numPerPage = 10;
      const lastPage = Math.ceil(count / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      const offset = (page - 1) * numPerPage;
      mysqlPool.query(
        'SELECT * FROM items ORDER BY id LIMIT ?,?',
        [ offset, numPerPage ],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve({
              items: results,
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
function getItemCount(mysqlPool) {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        'SELECT COUNT(*) AS count FROM items',
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
router.get('/', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
    getItemCount(mysqlPool)
      .then((count) => {
        return getItemPage(mysqlPool, parseInt(req.query.page) || 1, count);
      })
      .then((itemInfo) => {
      itemInfo.links = {};
      let { links, totalPages, pageNumber } = itemInfo;
        if (pageNumber < totalPages) {
          links.nextPage = '/item?page=' + (pageNumber + 1);
          links.lastPage = '/item?page=' + totalPages;
        }
        if (pageNumber > 1) {
          links.prevPage = '/item?page=' + (pageNumber - 1);
         links.firstPage = '/item?page=1';
        }
        res.status(200).json(itemInfo);
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json(

          {
            error: "Error fetching items list!!"
          });
      });
});

/*
 * Route to fetch info about a specific item.
 */
function getItemByID(mysqlPool, itemID) {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        'SELECT * FROM items WHERE id = ?',
        [ itemID ],
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
router.get('/:itemID', function (req, res, next){
  const mysqlPool = req.app.locals.mysqlPool;
    const itemID = parseInt(req.params.itemID);
    getItemByID(mysqlPool, itemID)
    .then((item) => {
        if(item){
            res.status(200).json(item);
        } else {
            next();
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({
            error: "Error feteching id from items."
        });
    });
});

/*
 * Route to create a new item.
 */
function insertNewItem(mysqlPool, item){
    return new Promise((resolve, reject) => {
        const itemValues = {
            id: null,
            playerID: item.playerID,
            name: item.name, 
            price: item.price,
            location: item.location,
            rarity: item.rarity
        };
        mysqlPool.query(
            'INSERT INTO items SET ?',
            itemValues,
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
router.post('/', function (req, res, next){
  const mysqlPool = req.app.locals.mysqlPool;
    if(req.body, req.body.playerID, req.body.price, req.body.location, req.body.rarity){
        insertNewItem(mysqlPool, req.body)
        .then((id)=>{
            res.status(201).json({
                id: id,
                links: {
                    item: '/items/' + id
                }
            });
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json({
                error: "Error inserting item."
            });
        });
    } else {
        res.status(400).json ({
            err: "Request needs a JSON body with player ID, price, location and rarity"
        });
    }
});
/*
* Route to update item by its itemID
*/
function updateItemByID(itemID, item) {
  return new Promise((resolve, reject) => {
    const itemValues = {
      playerID: item.playerID,
      name: item.name,
      price: item.price,
      location: item.location,
      rarity: item.rarity
    };
    mysqlPool.query(
      'UPDATE items SET ? WHERE id = ?',
      [ itemValues, itemID ],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
}
router.put('/:itemID', function (req, res, next) {
  const itemID = parseInt(req.params.itemID);
  if (req.body && req.body.playerID && req.body.name, req.body.price, req.body.location, req.body.rarity) {
    updateItemByID(itemID, req.body)
      .then((updateSuccessful) => {
        if (updateSuccessful) {
          res.status(200).json({
            links: {
              item: `/items/${itemID}`
            }
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          error: "Unable to update item."
        });
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a player id, name, price, location, and rarity."
    });
  }
});
/*
* Route to delete specific item
*/
function deleteItemByID(itemID) {
  return new Promise((resolve, reject) =>{
    mysqlPool.query(
      'DELETE FROM items WHERE id = ?',
      [ itemID ],
      function (err, result) {
        if(err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
}
router.delete('/:itemID', function (req, res, next){
  const itemID = parseInt(req.params.itemID);
  deleteItemByID(itemID)
  .then((deleteSuccesful) => {
    if(deleteSuccesful) {
      res.status(204).end();
    } else {
      next();
    }
  })
  .catch((err) => {
    console.log(err)
    res.status(500).json({
      error: "Unable to deletet item!"
    });
  });
});

