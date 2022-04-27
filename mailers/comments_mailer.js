const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment : comment} , '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from : 'quoradevs@gmail.com',
        to : comment.user.email,
        subject : 'New Comment Published',
        html : htmlString,
    }, (error,info)=>{
        if(error){
            console.log('Error in sending mail', error);
            return;
        }
        console.log('Message Deliverd', info);
        return;
    });
}