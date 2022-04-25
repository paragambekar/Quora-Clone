
const Post = require('../models/post');

module.exports.home = function(request,response){


    Post.find({})
    .populate('user')
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    })
    .exec(function(error,posts){
        if(error){
            console.log('Error in finding posts');
            return;
        }

        return response.render('home',{
            title : 'Quora',
            posts : posts
    
        });
    });

    
}