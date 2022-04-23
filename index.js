const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = 8000;



app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views','./views');




// use express router 
app.use('/', require('./routes/index'));

app.listen(port, function(error){
    if(error){
        console.log(`Error in running the server: ${error}`);
    }

    console.log(`Server is running on port: ${port}`);
});