const express = require("express");
const router = express.Router();
const partController = require("../controllers/partsController");

// Define routes
router.get("/", partController.list);

router.get("/new", partController.newPart);
router.get("/:id/edit", partController.editPartForm);
router.get("/:id/delete", partController.deletePart);

router.post("/new", partController.createPart);
router.post("/:id", partController.updatePart);

module.exports = router;
