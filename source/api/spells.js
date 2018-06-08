const router = require('express').Router();
const mysql = require('mysql');

router.get('/', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  res.status(200).json({
    url: req.url
  });
});

router.get('/:spellID', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  res.status(200).json({
    url: req.url
  });
});

router.post('/', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  res.status(200).json({
    url: req.url
  });
});

router.put('/:spellID', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  res.status(200).json({
    url: req.url
  });
});

router.delete('/:spellID', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  res.status(200).json({
    url: req.url
  });
});

exports.router = router;
