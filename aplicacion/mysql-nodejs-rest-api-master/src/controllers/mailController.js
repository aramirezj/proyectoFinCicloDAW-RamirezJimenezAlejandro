const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
  host: 'smtp.hasquiz.com', port: 587, secure: true,
  auth: {
    user: 'noreply@hasquiz.com',
    pass: 'Illidariweare16.0'
  },
  secure: false, tls: { rejectUnauthorized: false }, debug: true
});
let mailOptions = {
  from: '"Hasquiz" <noreply@hasquiz.com>', //Desde
  to: "", //Lista de emails
  subject: "", //Asunto
  //text: "El body churra", // plain text body
  html: "" //Mensaje 
};

class MailController {
  constructor() { }
  correoRegistro(email, mensaje) {
    mailOptions.to = email;
    mailOptions.subject = "Verificación de cuenta Hasquiz "
    mailOptions.html = 'Por favor, entra en el siguiente enlace para confirmar tu cuenta: <br><b>https://www.hasquiz.com/#/auth/login/' + mensaje + '</b>';
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
  }

  correoRecuperacion(email, mensaje) {
    mailOptions.to = email;
    mailOptions.subject = "Restablezca la contraseña solicitada para su cuenta de Hasquiz"
    mailOptions.html = 'Por favor, entra en el siguiente enlace para restablecer tu contraseña: <br><b>https://www.hasquiz.com/#/auth/forget/' + mensaje + '</b>';
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
  }
}

const mailService = new MailController();
module.exports = mailService;