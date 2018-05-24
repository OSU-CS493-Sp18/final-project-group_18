const router = require('express').Router();
const mysql = require('mysql');

function getTestRow(mysqlPool){
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM test',function(err, result){
      if(err){
        console.log(err);
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });
}

router.get('/', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;

  getTestRow(mysqlPool).then((row) => {
    res.status(200).json({
    result: row,
    url: req.url
    });
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.get('/:characterID', function(req, res){
    res.status(200).json({
      url: req.url
    });
});

router.get('/:characterID/items', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.get('/:characterID/spells', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.post('/', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.put('/:characterID', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.delete('/:characterID', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

exports.router = router;
