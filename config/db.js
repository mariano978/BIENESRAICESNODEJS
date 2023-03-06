//importamos el ORM
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASSWORD,
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: "mysql",
    define: {
      //esto crea dos columnas extras en la BD que indican cuando fue creado y modificado
      timestamps: true,
    },
    pool: {
      //max y min de conexiones por usuario
      max: 5,
      min: 0,
      //30seg intentara conectar antes de tirar un error
      acquire: 30000,
      //tiempo que debe transcurrir sin hacer nada para finalizar una conexion
      idle: 10000,
    },
    operatorsAliases: false,
  }
);

export default db;
