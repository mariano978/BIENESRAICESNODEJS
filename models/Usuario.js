import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Usuario = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
  },
  {
    //scripts que se ejecutan antes de crear, modificar, etc
    hooks: {
      beforeCreate: async function (usuario) {
        //hasheamos el password antes de crear la instancia
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
    },
    //los scopes sirven para modificar las consultas
    scopes: {
      eliminarPassword: {
        attributes: {
          exclude: ["password", "token", "confirmado", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

//metodos personalizados
Usuario.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default Usuario;
