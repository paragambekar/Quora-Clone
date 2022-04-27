const express = require('express');
const router = express.Router();

const upVotesController = require('../controllers/upvotes_controllers');

router.post('/toggle',upVotesController.toggleUpvote); 
// router.get('/toggle',upVotesController.toggleUpvote);  

module.exports = router;