const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
},
function(email, password, done){
    // find a user and establish the identity
    // first email as key is what we have defined in our schema and second one is the one from the current function 
    User.findOne({email: email}, function(error, user)  {
        if (error){
            console.log('Error in finding user through Passport');
            return done(error);
        }

        if (!user || user.password != password){
            // done function first argument is for error and second is authentication is done or not
            console.log('Invalid username/password');
            return done(null, false);
        }

        // if user is found we return the user  
        return done(null, user);
    });
}
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(error, user){
        if(error){
            console.log('Error in finding user --> Passport');
            return done(error);
        }

        return done(null, user);
    });
});

// using this function as a middlware
passport.checkAuthentication = function(request,response,next){
    
    // if user is signed in then pass on the request to the next function (controller action )
    // detects if the user is signed in or not 
    if(request.isAuthenticated()){
        return next();
    }
    // if user not found 
    return response.redirect('/users/sign-in');

}

passport.setAuthenticatedUser = function(request,response,next){
    if(request.isAuthenticated()){
        // request.user contains the current signed in user from the session cookie and we are just sending this to the locals for views
        console.log(response.locals.user);
        response.locals.user = request.user;
        console.log(response.locals.user);
    }
    next();
}


module.exports = passport;