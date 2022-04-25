const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(request,response){

    Post.create({
        content : request.body.content,
        user : request.user._id,

    }, function(error,post){
        if(error){
            console.log('Error in creating user');
            return;
        }

        return response.redirect('back');
    })

}

module.exports.destroy = function(request,response){

     Post.findById(request.params.id, function(error,post){

        if(post.user == request.user.id){
            post.remove();

            Comment.deleteMany({post : request.params.id}, function(error){
                return response.redirect('back');
            });
        }else{
            return response.redirect('back');
        }
     });




}