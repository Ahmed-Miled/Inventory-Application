const express = require("express");
const router = express.Router();
const partController = require("../controllers/partsController");

// Define routes
router.get("/", partController.list);

router.get("/new", (req, res) => {
  res.send("New Part Page");
});

module.exports = router;
