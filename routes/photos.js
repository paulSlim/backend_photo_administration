const express = require('express');

const photosController = require('../controllers/photos');

const router = express.Router();

router.get('/:id', photosController.getPhoto);
router.get('/', photosController.getPhotos);
router.post('/', photosController.postPhoto);
router.put('/', photosController.putPhoto);
router.delete('/:id', photosController.deletePhoto);
router.use((request, response) => response.status(404).end());

module.exports = router;