const { index } = require('../controllers/homeController');

const router = require('express').Router();

router.get("/", index);

module.exports = router;