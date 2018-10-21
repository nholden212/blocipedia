const express = require("express");
const router = express.Router();
const collabController = require("../controllers/collabController");

router.get("/wikis/:id/newCollab", collabController.new);
router.get("/wikis/:wikiId/:id/destroyCollab", collabController.destroy);

router.post("/wikis/:id/createCollab", collabController.create);

module.exports = router;
