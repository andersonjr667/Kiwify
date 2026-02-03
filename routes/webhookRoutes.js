const express = require("express");
const { handleKiwifyWebhook } = require("../controllers/webhookController");

const router = express.Router();

router.post("/kiwify", handleKiwifyWebhook);

module.exports = router;
