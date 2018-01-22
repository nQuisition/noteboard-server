const express = require('express');
const router = express.Router();

const noteController = require('../controllers/note');
const checkAuth = require('../middleware/checkauth');

router.post('/', checkAuth(), noteController.postOwn);
router.delete('/', checkAuth(), noteController.deleteOwn);
router.get('/', checkAuth(), noteController.getOwn);
router.patch('/', checkAuth(), noteController.updateOwn)
//router.delete('/:userId', checkAuth(), noteController.delete);

module.exports = router;