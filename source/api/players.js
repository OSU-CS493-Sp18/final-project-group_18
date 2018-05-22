const router = require('express').Router();

router.get('/:playerID/characters', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

router.post('/', function(req, res){
  res.status(200).json({
    url: req.url
  });
});

exports.router = router;
