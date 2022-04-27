const Post = require('../models/post');
const Comment = require('../models/comment');
const Upvote = require('../models/upvote');

module.exports.create = async function(request,response){

    
    try{
        let post = await Post.create({
            content : request.body.content,
            user : request.user._id,
        });

        let populatePost = await Post.findById(post._id).populate('user','-password');

        if(request.xhr){
            return response.status(200).json({
                data : {
                    post : populatePost,
                },
                message : "Post Created",
            })
        }

        request.flash('success', "Post Created");
        return response.redirect('back');

    }catch(error){
        request.flash('error', error);
        return response.redirect('back');
    }

}

module.exports.destroy = async function(request,response){

    try{
        let post = await Post.findById(request.params.id); 

        if(post.user == request.user.id){

            // delete associated likes  
            await Upvote.deleteMany({ upvoteable : post , onModel : 'Post'});
            await Upvote.deleteMany({ _id : { $in: post.comments} });

            post.remove();

            await Comment.deleteMany({post : request.params.id});

            if(request.xhr){
                console.log('xhr request to delete');
                return response.status(200).json({
                    data : {
                        post_id : request.params.id,
                    },
                    message : "Post deleted successfully"
                })
            }
            
            request.flash('success','Post & associated comments deleted');
            return response.redirect('back');
        }else{
            request.flash('error','You cannot delete this post');
            return response.redirect('back');
        }
    }catch(error){
        request.flash('error',error);
        console.log('Error in deleting post',error);
        return;
    }
}