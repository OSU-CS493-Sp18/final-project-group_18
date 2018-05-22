const router = require('express').Router();

router.get('/', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.get('/:itemID', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.post('/', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.put('/:itemID', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.delete('/:itemID', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

exports.router = router;
