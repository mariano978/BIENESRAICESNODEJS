import jwt from "jsonwebtoken";

const generarId = () =>
  Math.random().toString(32).substring(2) + Date.now().toString(32);

const generarJWT = (datos) =>
  jwt.sign({ nombre: datos.nombre, id: datos.id }, process.env.PRIVATE_PASS, {
    expiresIn: "1d",
  });

export { generarId, generarJWT };
