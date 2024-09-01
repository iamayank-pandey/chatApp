const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

const sendEmail = async options =>{
    // const oauth2Client = new google.auth.OAuth2(
    //     process.env.CLIENT_ID,
    //     process.env.CLIENT_SECRET,
    //     process.env.REDIRECT_URI
    // );
    // oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });    
    // const accessToken = await oauth2Client.getAccessToken();
    var transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            // type: 'OAuth2',
            // user: process.env.JAX_EMAIL,
            // clientId: process.env.CLIENT_ID,
            // clientSecret: process.env.CLIENT_SECRET,
            // refreshToken: process.env.REFRESH_TOKEN,
            // accessToken: accessToken

            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const message ={
        from: `Clan <noreply@gmail.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // attachments: options.attachments
    }

    await transporter.sendMail(message);
}

module.exports = sendEmail;