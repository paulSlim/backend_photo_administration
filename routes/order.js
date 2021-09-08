const express = require("express");

const orderController = require("../controllers/order");

const router = express.Router();

router.post("/", orderController.movePhoto);
router.use((request, response) => response.status(404).end());

module.exports = router;
