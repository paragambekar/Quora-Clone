
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(request,response){

    try{
    
    
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'upvotes',
      },
      populate:{
       path:'user',
       select: '-password',
      }
    }).populate('upvotes')

    // let tp = await Post.find({})
    // .populate('user','-password')
    // .populate({
    //     path : 'comments',
    //     populate : {
    //         path: 'upvotes',
    //     }
    // })
    
    // console.log('Populated************',tp);


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