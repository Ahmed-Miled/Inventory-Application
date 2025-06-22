const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

// Good routes
router.get("/", categoriesController.list);

router.get("/new", (req, res) => {
  res.send("New Category Page");
  //res.render("categories/new", { title: "New Category" });
});

module.exports = router;
