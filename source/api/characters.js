const router = require('express').Router();

router.get('/', function(req, res){
  res.status(200).json({
    url: req.url
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
