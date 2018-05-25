const router = require('express').Router();
const mysql = require('mysql');


exports.router = router;

const playerSchema = {
    playerID: {require: true},
    username: {require: true},
    password: {require: true}
};
/*
 * Fetch information from every players
*/
function getPlayerInfo(mysqlPool){
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT * FROM players',
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        )
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
});

/*
 * Fetch character information from specific player.
 */
router.get('/:playerID/characters', function(req, res){
    res.status(200).json({
        url:req.url
    });
});


/*
 * Route to create a new player.
 */
function insertNewPlayer(mysqlPool, player){
    return new Promise((resolve, reject) => {
        const playerValues = {
            id: null,
            playerID: player.playerID,
            username: player.username,
            password: player.password
        };
        mysqlPool.query(
            'INSERT INTO players SET ?',
            playerValues,
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
    if(req.body, req.body.playerID, req.body.username, req.body.password){
        insertNewPlayer(req.body)
        .then((id)=>{
            res.status(201).json({
                id: id,
                links: {
                    player: '/players/' + id
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

//login endpoint
router.post('/login', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;

  res.status(200).json({
    token: "jwt goes here"
  });
});
