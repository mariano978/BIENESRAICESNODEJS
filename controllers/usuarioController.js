//req es lo que enviamos del HTML a el servidor de node
//res es la respuesta del servidor al HTML
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/email.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesion",
    csrfToken: req.csrfToken(),
    errores: {}
  });
};

const autenticarLogin = async (req, res) => {
  const { email, password } = req.body;

  await check("email").isEmail().withMessage("Email no valido").run(req);
  await check("password")
    .notEmpty()
    .withMessage("El password es obligatorio")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //si hay errores renderizamos la pagina con los errores
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: resultado.array(),
      usuario: {
        email,
      },
      csrfToken: req.csrfToken(),
    });
  }

  //comprobar si el usuario existe
  const usuario = await Usuario.findOne({
    where: {
      email,
    },
  });

  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: [
        {
          msg: "El usuario no existe",
        },
      ],
      usuario: {
        email,
      },
      csrfToken: req.csrfToken(),
    });
  }

  //comprobar que el usuario este confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: [
        {
          msg: "Usuario no confirmado, revisa tu email",
        },
      ],
      usuario: {
        email,
      },
      csrfToken: req.csrfToken(),
    });
  }

  //si el email es valido y está confirmado, verificamos el password
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: [
        {
          msg: "Credenciales incorrectas",
        },
      ],
      usuario: {
        email,
      },
      csrfToken: req.csrfToken(),
    });
  }

  //autenticar al usuario, y guardar en cookie
  const token = generarJWT(usuario);

  return res
    .cookie("_token", token, {
      httpOnly: true, //evita poder leer los cokies de la consola
      // secure: true , //para conexiones seguras ssl
    })
    .redirect("/mis-propiedades");
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
    errores: {}
  });
};

const registrar = async (req, res) => {
  //validacion
  const { password, nombre, email } = req.body;
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email").isEmail().withMessage("Email no valido").run(req);
  await check("password")
    .isLength({ min: 6, max: 16 })
    .withMessage("El password debe tener entre 6 y 16 caracteres")
    .run(req);
  await check("repetir_password")
    .equals(password)
    .withMessage("Los passwords no son iguales")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //si hay errores renderizamos la pagina con los errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre,
        email,
      },
      csrfToken: req.csrfToken(),
    });
  }

  //verificar que el usuario no este duplicado
  const existeUsuario = await Usuario.findOne({
    where: {
      email,
    },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [
        {
          msg: "Ya existe un usuario asociado a este email, pruebe inciar sesion",
        },
      ],
      csrfToken: req.csrfToken(),
    });
  }

  //almacenamos el usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  //enviar mail de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    pagina: "Confirma tu cuenta",
    mensaje:
      "Su cuenta se ha creado con exito, te enviamos un mail de confirmacion revisa tu bandeja ;D",
  });
};

const formulariOlvidePassword = (req, res) => {
  res.render("auth/recuperar-password", {
    pagina: "Recuperar password",
    csrfToken: req.csrfToken(),
    errores: {}
  });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  await check("email").isEmail().withMessage("Email no valido").run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //si hay errores renderizamos la pagina con los errores
    return res.render("auth/recuperar-password", {
      pagina: "Recuperar password",
      errores: resultado.array(),

      csrfToken: req.csrfToken(),
    });
  }

  //Buscar al usuario
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    //si hay errores renderizamos la pagina con los errores
    return res.render("auth/recuperar-password", {
      pagina: "Recuperar password",
      errores: [{ msg: "Usuario no existente" }],
      csrfToken: req.csrfToken(),
    });
  }

  //Generar token y enviar email
  await usuario.update({
    token: generarId(),
  });

  emailOlvidePassword(usuario);

  res.render("templates/mensaje", {
    pagina: "Recuperar password",
    mensaje:
      "Te hemos enviado un mail con las instriciones para cambiar tu password",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  //Buscamos el usuario que tenga ese token
  const usuario = await Usuario.findOne({
    where: {
      token,
    },
  });

  if (!usuario) {
    return res.render("auth/confirmar", {
      pagina: "Recuperar password",
      mensaje: "Ha ocurrido algun error :C",
      error: true,
    });
  }

  //formulario para cambiar password
  res.render("auth/reset-password", {
    pagina: "Reset Password",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  //Validamos password
  await check("password")
    .isLength({ min: 6, max: 16 })
    .withMessage("El password debe tener entre 6 y 16 caracteres")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //si hay errores renderizamos la pagina con los errores
    return res.render("auth/reset-password", {
      pagina: "Reset Password",
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { password } = req.body;
  const { token } = req.params;

  //Buscamos el usuario que tenga ese token
  const usuario = await Usuario.findOne({
    where: {
      token,
    },
  });

  //hasheamos y guardamos pasword (sequelize lo hashea solo al momento de crear)
  const salt = await bcrypt.genSalt(10);
  await usuario.update({
    password: await bcrypt.hash(password, salt),
    token: null,
  });

  res.render("auth/confirmar", {
    pagina: "Reset Password",
    mensaje: "Su password ha sido cambiado con exito :D.",
  });
};

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;

  //Buscamos el usuario que tenga ese token
  const usuarioExistente = await Usuario.findOne({
    where: {
      token,
    },
  });

  console.log(token);

  if (!usuarioExistente) {
    return res.render("auth/confirmar", {
      pagina: "Confirmar cuenta",
      mensaje: "Ha ocurrido algun error :C",
      error: true,
    });
  }

  //confirmamos al usuario
  await usuarioExistente.update({
    token: null,
    confirmado: true,
  });

  res.render("auth/confirmar", {
    pagina: "Confirmar cuenta",
    mensaje: "Cuenta confirmada con exito. :D",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  formulariOlvidePassword,
  confirmarCuenta,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticarLogin,
};
