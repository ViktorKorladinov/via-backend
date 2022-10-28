const express = require('express');
const {register, login, auth} = require("../auth/auth");
const router = express.Router();

router.route('/register').post(register)
router.route("/login").post(login);

router.route('/leaderboard').get(auth, (req, res, next) => res.status(200).json({
    message: "auth testing",
}))

module.exports = router;
