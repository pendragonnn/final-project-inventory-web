const express = require('express');
const router= express.Router();
const upload = require('../util/upload');
const itemsController = require('../controller/itemsController');
const uploadDir = require('../middleware/upload')

// items controller
router.get('/items', itemsController.getAllItems);
router.get('/items/:id', itemsController.getDetailsItems);
router.post('/items', itemsController.createItems);
router.post('/items/upload', upload.single('image_url'), itemsController.uploadImage);
router.put('/items/:id', itemsController.updateItems);
router.delete('/items/:id', itemsController.softDeleteItems);
router.use('/items/upload',express.static( uploadDir));



module.exports = router;