const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    // include the array of comments on a post 
    comments : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment',
        }
    ],
    upvotes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Upvote', 
        }
    ]
},{
    timestamps : true
});

// export the model 
const Post = mongoose.model('Post',postSchema);
module.exports = Post; 