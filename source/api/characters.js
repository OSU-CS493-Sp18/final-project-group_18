const router = require('express').Router();

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
  nickname: { required: false },
  age: { required: false },
  gender: { required: false },
  expeerience: { required: false }
};

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
