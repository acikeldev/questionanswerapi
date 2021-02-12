const nodemailer = require("nodemailer");
const asyncErrorWrapper = require("express-async-handler");

const sendEmail = asyncErrorWrapper(async(mailOptions)=>{
    
    let transporter = nodemailer.createTransport({
        service:"gmail",
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.SMTP_PASS,
        }
    });
    
    let info = await transporter.sendMail(mailOptions);
    
    console.log(`Message sent : ${info.messageId}`)
});

module.exports = sendEmail;