const express = require("express");
const router = express.Router();
const sign_up_controller = require("../controllers/signUpController");

router.get("/", sign_up_controller.sign_up_page)
router.post("/", sign_up_controller.sign_up_post)

module.exports = router;
