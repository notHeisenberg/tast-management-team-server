const { index } = require('../controllers/homeController');
const { setToken } = require('../services/homeServices');

const router = require('express').Router();

router.get("/", index);
router.post("/jwt", setToken)

module.exports = router;