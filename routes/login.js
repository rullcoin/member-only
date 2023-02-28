const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");


router.get("/", loginController.login_get)
router.post("/", loginController.login_post)
router.get("/join_club", loginController.join_club_get)
router.post("/join_club", loginController.join_club_post)

module.exports = router;