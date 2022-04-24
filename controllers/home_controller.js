
const Post = require('../models/post');

module.exports.home = function(request,response){

    // Post.find({},function(error,posts){
    //     if(error){
    //         console.log('Error in finding posts');
    //         return;
    //     }

    //     return response.render('home',{
    //         title : 'Quora',
    //         posts : posts
    
    //     });
    // })

    Post.find({}).populate('user').exec(function(error,posts){
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