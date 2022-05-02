require('dotenv').config();
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
  })


const development = {
    name : 'development',
    asset_path : "./assets",
    session_cookie_key : 'helloworld',
    db : 'quora-development',
    smtp : {
        service : process.env.QUORA_SMTP_SERVICE,
        host : process.env.QUORA_SMTP_HOST,
        port : process.env.QUORA_SMTP_PORT,
        secure : false,
        auth : {
            user : process.env.QUORA_GMAIL_USERNAME,
            pass : process.env.QUORA_GMAIL_PASSWORD,
        }
 
    },
    google_client_id : process.env.QUORA_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.QUORA_GOOGLE_CLIENT_SECRET,
    google_call_back_url : process.env.QUORA_GOOGLE_CALL_BACK_URL, 
    morgan : {
        mode : 'dev',
        options : {stream : accessLogStream}

    }
}

const production = {
    name : 'production', 
    asset_path : "./assets",
    session_cookie_key : process.env.QUORA_SESSION_COOKIE_KEY,
    db : 'quora-production',
    smtp : { 
        service : process.env.QUORA_SMTP_SERVICE,
        host : process.env.QUORA_SMTP_HOST,
        port : process.env.QUORA_SMTP_PORT,
        secure : false,
        auth : {
            user : process.env.QUORA_GMAIL_USERNAME,
            pass : process.env.QUORA_GMAIL_PASSWORD,
        }

    },
    google_client_id : process.env.QUORA_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.QUORA_GOOGLE_CLIENT_SECRET,
    google_call_back_url : process.env.QUORA_GOOGLE_CALL_BACK_URL,
    morgan : {
        mode : 'combined',
        options : {stream : accessLogStream}

    }
}

module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);