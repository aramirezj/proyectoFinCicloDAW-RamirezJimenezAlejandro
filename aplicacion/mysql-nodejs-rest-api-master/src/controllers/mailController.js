const nodeMailer = require('nodemailer');

class MailController {
    constructor() { }
    enviaCorreo(email,mensaje) {
        let transporter = nodeMailer.createTransport({
          host: 'smtp.hasquiz.com',
          port: 587,
          secure: true,
          auth: {
            user: 'noreply@hasquiz.com',
            pass: 'Illidariweare16.0'
          },
          secure: false,
          tls: { rejectUnauthorized: false },
          debug: true
        });
        let mailOptions = {
          from: '"Hasquiz" <noreply@hasquiz.com>', //Desde
          to: email, //Lista de emails
          subject: "Confirma tu dirección de email", //Asunto
          //text: "El body churra", // plain text body
          html: 'Por favor, entra en el siguiente enlace para confirmar tu cuenta: <br><b>'+mensaje+'</b>' //El mensaje
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
      }
}

const mailService = new MailController();
module.exports = mailService;