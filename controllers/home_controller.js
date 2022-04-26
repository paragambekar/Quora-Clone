
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(request,response){

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path : 'user'
            }
    });
    

    let users = await User.find({});
    
    return response.render('home',{
        title : 'Quora',
        posts : posts,
        all_users : users,
    });
       
    }catch(error){
        console.log('Error',error);
        return;
    } 
}