const express = require("express");
const router = express.Router();
const brandsController = require("../controllers/brandsController");

router.get("/", brandsController.getAllBrands);
router.get('/new', brandsController.newBrand);
router.post('/new', brandsController.createBrand);
router.post('/:id', brandsController.deleteBrand);

module.exports = router;