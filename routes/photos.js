const express = require("express");

const photosController = require("../controllers/photos");

const router = express.Router();

router.get("/", photosController.getPhotos);
router.post("/", photosController.postPhoto);
router.put("/", photosController.putPhoto);
router.patch("/", photosController.patchPhoto);
router.delete("/", photosController.deletePhoto);
router.use((request, response) => response.status(404).end());

module.exports = router;
