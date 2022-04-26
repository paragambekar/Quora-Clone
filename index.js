const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = 8000;
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({

    src : './assets/scss',
    dest : './assets/css',
    // debug : true,
    outputStyle : 'extended',
    prefix : '/css',
}));


app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads', express.static(__dirname +'/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views','./views');

app.use(session({

    name : 'quora',
    secret : 'helloworld',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/quora-development',
        autoRemove : 'disabled',
    },function(error){
        console.log(error || 'Connect MongoDB setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router 
app.use('/', require('./routes/index'));


app.listen(port, function(error){
    if(error){
        console.log(`Error in running the server: ${error}`);
    }

    console.log(`Server is running on port: ${port}`); 
});