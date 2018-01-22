const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const checkAuth = require('../middleware/checkauth');

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/list', /*checkAuth('admin'),*/ userController.getAll);
router.delete('/:userId', checkAuth('admin'), userController.delete);

module.exports = router;