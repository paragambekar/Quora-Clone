const Post = require('../models/post');

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