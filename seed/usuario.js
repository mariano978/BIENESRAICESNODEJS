import bcryp from "bcrypt";

const usuario = [
  {
    nombre: "Mariano",
    email: "correo@correo.com",
    confirmado: 1,
    password: bcryp.hashSync("asdasd", 10),
  },
];

export default usuario;
