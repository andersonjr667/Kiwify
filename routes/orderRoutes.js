const express = require("express");
const { validateOrder } = require("../controllers/orderController");

const router = express.Router();

router.get("/validate", validateOrder);

module.exports = router;
