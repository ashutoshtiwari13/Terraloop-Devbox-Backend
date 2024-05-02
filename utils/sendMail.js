import nodemailer from 'nodemailer';

 async function sendMail(message,email, subject ,...args){
   try {
    const transport   = nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: 587,
        auth: {
          user: process.env.BREVO_USER_EMAIL,
          pass: process.env.BREVO_PASSWORD,
        },
    });
    await transport.sendMail({
        to:email,
        from:process.env.BREVO_USER_EMAIL,
        subject:subject,
        html:message
    })
   } catch (error) {
    console.log(error);
   }
 }

 export default sendMail;