const express = require('express');

const themesController = require('../controllers/themes');

const router = express.Router();

router.get('/', themesController.getThemes);
router.post('/', themesController.postTheme);
// router.put('/', themesController.putTheme);
// router.delete('/:id', themesController.deleteTheme);
router.use((request, response) => response.status(404).end());

module.exports = router;