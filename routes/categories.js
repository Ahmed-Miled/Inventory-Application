const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

// Good routes
router.get("/", categoriesController.list);

router.get("/new", categoriesController.newCategory);
router.post("/new", categoriesController.createCategory);

//router.get("/:id/edit", categoriesController.showCategory);
router.get("/:id/showCategorie", categoriesController.editCategoryForm);
router.get("/:id/delete", categoriesController.deleteCatregory);

router.post("/:id", categoriesController.updateCategory);

module.exports = router;
