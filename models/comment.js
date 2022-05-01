const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content :{
        type : String,
        required : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,  
        ref : 'User',
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
    },
    upvotes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Upvote', 
        }
    ]
},{
    timestamps : true
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;