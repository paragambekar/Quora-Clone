const { redirect } = require('express/lib/response');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Upvote = require('../models/upvote');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function(request,response){

    try{
        let post = await Post.findById(request.body.post);

        if(post){
            let comment = await Comment.create({
                content : request.body.content,
                user : request.user._id,
                post : request.body.post,
            });

                post.comments.push(comment);
                post.save();

               let populateComment = await Comment.findById(comment._id).populate('user','-password').populate('post');
                // console.log('populateComment', populateComment);
                // commentsMailer.newComment(populateComment);
                let job = queue.create('emails', populateComment).save(function(err){
                    if (err){
                        console.log('Error in sending to the queue', err);
                        return;
                    }
                    console.log('job enqueued', job.id);
     
                });

                if (request.xhr){
                    console.log('xhr request for comment');
                    
                    return response.status(200).json({
                        data: {
                            comment: populateComment,
                        },
                        message: "Post created!"
                    });
                }

                request.flash('success','Comment Added');
                response.redirect('/')  
        }
    }catch(error){
        console.log('Error',error);
        return;
    }
   
}


module.exports.destroy = async function(request, response){

    try{
        let comment = await Comment.findById(request.params.id);
        if (comment.user == request.user.id){

            let postId = comment.post; 

            comment.remove();

            await Post.findByIdAndUpdate(postId, { $pull: {comments: request.params.id}});

            // delete associated like of comments 
            await Upvote.deleteMany({ upvotable : comment._id , onModel : 'Comment'});

            if (request.xhr){
                console.log('xhr to del comment');
                return response.status(200).json({
                    data: {
                        comment_id: request.params.id
                    },
                    message: "Post deleted"
                });
            }

            request.flash('success','Comment Deleted');
            return response.redirect('back');
        }else{
            return response.redirect('back');
        }
    }catch(error){
        console.log('Error',error);
        return;
    }

    
} 