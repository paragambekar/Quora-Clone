const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(request,response){

        User.findById(request.params.id, function(error,user){
            return response.render('user_profile',{
                title : 'User Profile',
                profile_user : user,
            });
        });
        
}

module.exports.update = async function(request,response){

    if(request.user.id == request.params.id){

        try{

            let user = await User.findByIdAndUpdate(request.params.id);
            User.uploadedAvatar(request,response, function(error){
                if(error){
                    console.log('*******Multer Error',error);
                    return;
                }

                user.name = request.body.name;
                user.email = request.body.email;

                if(request.file){
                    if(user.avatar){ 
                        // user.avatar stores path from uploads// 
                        fs.unlinkSync(path.join(__dirname, '..' ,user.avatar));
                    }

                    // saving the path of the uploaded into avatar field  of user
                    user.avatar = User.avatarPath + '/' + request.file.filename;
                }
                user.save();
                return response.redirect('back');
            });

        }catch(error){
            request.flash('error', error);
            return response.redirect('back');
        }
    
    }else{
        request.flash('error','Unauthorized');
        return response.status(401).send('Unauthorized');
    }
    
}

module.exports.signUp = function(request,response){
    
    // if user already signed in redirect to profile page 
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_up',{
        title : 'Quora | Sign Up',
        // profile_user : user,
    });
}

module.exports.signIn = function(request,response){

    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_in',{
        title : 'Quora | Sign In',
        // profile_user : user,
    });
}

// get the sign up data 
module.exports.create = function(request,response){

    if(request.body.password != request.body.confirm_password){
        return response.redirect('back');
    } 

    User.findOne({email : request.body.email}, function(error,user){
        if(error){
            console.log('Error in finding user while signing up');
            return;
        }

        // if user not found, create one 
        if(!user){
            User.create(request.body, function(error, user){

                if(error){
                    console.log('Error in creating while signing user');
                    return;
                }
                request.flash('success','New user created');
                return response.redirect('/users/sign-in');

            });
        }else{
            return response.redirect('/users/sign-in');
        }
    })


}

// Sign in and create a session 
module.exports.createSession = function(request,response){
    request.flash('success','Logged In Successfully');
    return response.redirect('/');
}

module.exports.destroySession = function(request,response){

    // passport js gives this method to logout user 
    request.logout();
    request.flash('success','Logged Out Successfully');
    return response.redirect('/');
}


