const router = module.exports = require('express').Router();

router.use('/characters', require('./characters').router);
router.use('/items', require('./items').router);
router.use('/players', require('./players').router);
router.use('/spells', require('./spells').router);
