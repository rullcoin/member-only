var express = require('express');
var router = express.Router();
const messageController = require("../controllers/messageController")

/* GET home page. */
router.get('/', messageController.message_get);
router.post("/", messageController.message_post )

module.exports = router;
