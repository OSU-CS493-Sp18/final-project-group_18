import { resolve } from 'dns';

const router = require('express').Router();
const validation = require('../../lib/validation');
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

let players = require('../players');

exports.router = router;
exports.players = players;

const playerSchema = {
    playerID: {require: true},
    username: {require: true},
    password: {require: true}
};


/*
 * Fetch information from every players 
*/
function getPlayerInfo(){
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
    getPlayerInfo()
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
function insertNewPlayer(player){
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