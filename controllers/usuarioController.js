//req es lo que enviamos del HTML a el servidor de node
//res es la respuesta del servidor al HTML
import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesion",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
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
    });
  }

  const usuario = await Usuario.create(req.body);
};

const olvidePassword = (req, res) => {
  res.render("auth/recuperar-password", {
    pagina: "Recuperar password",
  });
};

export { formularioLogin, formularioRegistro, registrar, olvidePassword };
