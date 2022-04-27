const Post = require('../models/post');
const Comment = require('../models/comment');
const Upvote = require('../models/upvote');

module.exports.toggleUpvote = async function(request,response){

    try{

        let upvoteable;
        let deleted = false;

        if(request.query.type == 'Post'){
            upvoteable = await Post.findById(request.query.id).populate('upvotes');
        }else{
            upvoteable = await Comment.findById(request.query.id).populate('upvotes');
        }

        // check if there exists a like already 
        let existingUpvote = await Upvote.findOne({
            upvoteable : request.query.id,
            onModel : request.query.type,
            user : request.user._id,
        })

        if(existingUpvote){
            upvoteable.upvotes.pull(existingUpvote._id);
            upvoteable.save();

            await Upvote.deleteOne({
                user: request.user._id,
                upvoteable: request.query.id,
                onModel: request.query.type
            });
            deleted = true;
        }else{

            let newUpvote = await Upvote.create({
                user : request.user._id,
                upvoteable : request.query.id,
                onModel : request.query.type,
            });

            upvoteable.upvotes.push(newUpvote._id);
            upvoteable.save();
        }

        return response.status(200).json({
            message : 'Request Successful',
            data : {
                deleted : deleted,
            }
        })

    }catch(error){
        console.log('Error in upvoting',error);
        return response.status(500).json({
            message : 'Internal Server Error'
        })
    }

}
