//seeds
import categorias from "./catetgorias.js";
import precios from "./precio.js";
//models
import { Categoria, Precio } from "../models/index.js";

//db
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    await db.authenticate();

    await db.sync();

    //El promise.all corre de manera paralela, pero espera a que todos terminen
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
    ]);

    console.log("Datos importados correctamente");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const eliminarDatos = () => {
  // await db.authenticate();

  // await db.sync();

  db.query("SET FOREIGN_KEY_CHECKS = 0")
    .then(() => {
      return Categoria.truncate();
    })
    .then(() => {
      return Precio.truncate();
    })
    .then(() => {
      return db.query("SET FOREIGN_KEY_CHECKS = 1");
    })
    .then(() => {
      console.log("Datos eliminados correctamente");
      process.exit();
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-d") {
  eliminarDatos();
}
