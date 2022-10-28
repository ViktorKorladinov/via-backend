const express = require('express');
const {auth} = require("../auth/auth");
const {add, top} = require("../leaderboard/leaderboard");
const router = express.Router();

router.route('/add').post(auth, add)
router.route("/top/:limit?").get(top);

module.exports = router;
