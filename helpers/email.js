import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  //Enviar email
  await transport.sendMail({
    from: "BienesRaices",
    to: email,
    text: "Confirma tu cuenta en BienesRaices",
    subject: "Confirma tu cuenta en BienesRaices",
    html: `
    <p> Hola ${nombre}, haz click en el siguiente enlace para confirmar tu cuenta </p>
    <a href=${process.env.HOST}auth/confirmar/${token}>Confirma tu cuenta, click aqui...<a>
    <p>Si tu no creaste esta cuenta puedes ignorar este correo.</p>`,
  });
};

const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  //Enviar email
  await transport.sendMail({
    from: "BienesRaices",
    to: email,
    text: "Reestablece tu password en BienesRaices",
    subject: "Reestablece tu password en BienesRaices",
    html: `
    <p> Hola ${nombre}, haz click en el siguiente enlace para reestablecer tu password </p>
    <a href=${process.env.HOST}auth/recuperar-password/${token}>Reset Password, click aqui...<a>
    <p>Si tu no creaste solicitastte el cambio, ignorar este correo.</p>`,
  });
};

export { emailRegistro, emailOlvidePassword };
