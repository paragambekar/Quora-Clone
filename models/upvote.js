const mongoose = require('mongoose');


const upvoteSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,

    },
    // defines the object id of the upvoted object 
    upvoteable : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        refPath : 'onModel',
    },
    // this is used for defining the type of upvoted object as it is dynamic ref.
    onModel : {
        type : String,
        required : true,
        enums : ['Post','Comment'],
    }

},{
    timestamps : true
});

const Upvote = mongoose.model('Upvote',upvoteSchema);
module.exports = Upvote;