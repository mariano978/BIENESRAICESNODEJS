import jwt from "jsonwebtoken";
import { Usuario } from "../models/Index.js";

const protegerRuta = async (req, res, next) => {
  //verificar si hay un token en la cookie
  const { _token } = req.cookies;
  if (!_token) {
    return res.redirect("/auth/login");
  }

  //comprobar el token
  try {
    const decoded = jwt.verify(_token, process.env.PRIVATE_PASS);
    const usuario = await Usuario.scope("eliminarPassword").findByPk(
      decoded.id
    );
    //almacenamos el usuario en el req
    if (usuario) {
      req.usuario = usuario.dataValues;
    } else {
      return res.redirect("/auth/login");
    }
    return next();
  } catch (error) {
    console.log(error);
    console.log("token inválido");
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default protegerRuta;
