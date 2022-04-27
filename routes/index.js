const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');


console.log('Router Loaded');

router.get('/', homeController.home);
router.use('/users', require('./users')); 
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/upvotes',require('./upvotes'))


module.exports = router;