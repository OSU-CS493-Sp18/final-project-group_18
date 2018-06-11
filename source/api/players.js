const router = require('express').Router();
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');

const saltSize = 8;

exports.router = router;

const playerSchema = {
    name: {require: false},
    username: {require: true},
    password: {require: true},
    email: {require: true}
};
/*
 * Fetch information from every players
*/
function getPlayerInfo(mysqlPool){
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT id, username, email FROM players',
            function(err, results){
                if(err){
                  console.log(err);
                    reject(err);
                } else{
                    resolve(results);
                }
            })
    });
}

router.get('/', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
    getPlayerInfo(mysqlPool)
    .then((playerInfo) => {
        if(playerInfo){
            res.status(200).json(playerInfo);
        } else {
            next();
        }
    })
    .catch((err) => {
        console.long(err)
        res.status(500).json({
            error: "Error fetching information from players"
        });
    });
}); //This works

/*
 * Fetch character information from specific player.
 */
function getPlayerByID(mysqlPool, playerID){
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM players WHERE id=?',
    [ playerID ],
    function(err, result){
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(result[0]);
        }
    })
  });
}

router.get('/:playerid', requireAuthentication, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
    getPlayerByID(mysqlPool, req.params.playerid)
      .then((player) => {
        if (req.user !== player.username) {
          Promise.reject(403);
        }
        if (player) {
          res.status(200).json(player);
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err === 403) {
          res.status(403).json({
            error: "Unauthorized to access this resource"
          });
        }
        else {
          res.status(500).json({
            error: "Failed to fetch player. Please try again later."
          });
        }
      });
});

function getCharactersByPID(mysqlPool, pid){
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM characters WHERE playerid=?',
    pid,
    function(err, results){
      if(err){
        console.log(err);
        reject(err);
      } else{
        resolve(results);
      }
    })
  });
}

router.get('/:playerID/characters', requireAuthentication, function(req, res, next){
  const mysqlPool = req.app.locals.mysqlPool;
  links = [];
    getPlayerByID(mysqlPool, req.params.playerID)
    .then((player) => {
      return getCharactersByPID(mysqlPool, player.id);
    })
    .then((characters) => {
      for(i=0; i<characters.length; i++){
        links[i] = `/characters/${characters[i].id}`;
      }
      res.status(200).json({
        characters: characters,
        links: links
      });
    })
    .catch((err) => {
      next();
    });
});


/*
 * Route to create a new player.
 */
function insertNewPlayer(mysqlPool, player){
  return bcrypt.hash(player.password, saltSize)
  .then((passwordHash) => {
        var playerValues = {
            id: null,
            username: player.username,
            password: passwordHash,
            email: player.email
        };
        if(player.name){
          playerValues.name = player.name;
        }
        return new Promise((resolve, reject) => {
          mysqlPool.query(
              'INSERT INTO players SET ?',
              playerValues,
              function(err, result){
                  if(err){
                    console.log(err)
                    reject(err);
                  } else{
                    resolve(result.insertId);
            }
          });
      });
    });
}

router.post('/', function (req, res, next){
  const mysqlPool = req.app.locals.mysqlPool;
    if(validateAgainstSchema(req.body, playerSchema)){
        insertNewPlayer(mysqlPool, req.body)
        .then((id) => {
            res.status(201).json({
                id: id,
                links: {
                    player: `/players/${id}`
                }
            });
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json({
                error: "Error inserting player."
            });
        });
    } else {
        res.status(400).json ({
            err: "Request needs a JSON body with player ID, user name and password"
        });
    }
});

function getPlayerByName(mysqlPool, username){
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM players WHERE username=?',
    username,
    function(err, result){
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(result[0]);
        }
    })
  });
}

//login endpoint
router.post('/login', function(req, res, next){
  const mysqlPool = req.app.locals.mysqlPool;

  if(req.body && req.body.username && req.body.password){
    getPlayerByName(mysqlPool, req.body.username)
      .then((user) => {
        if(user){
          return bcrypt.compare(req.body.password, user.password);
        } else{
          console.log(user);
          return Promise.reject(401);
        }
      }).then((loginSucceeded) => {
        if(loginSucceeded){
          return generateAuthToken(req.body.username);
        } else {
          console.log(loginSucceeded);
          return Promise.reject(401);
        }
      }).then((token) => {
        res.status(200).json({
          token: token
        });
      }).catch((err) => {
        console.log(err);
        if(err === 401){
          next();
        } else {
          res.status(500).json({
            error: "login failed"
          });
        }
      });
  } else{
    res.status(400).json({
      error: "invalid request body"
    });
  }
});

exports.router = router;
exports.getPlayerByID = getPlayerByID;
