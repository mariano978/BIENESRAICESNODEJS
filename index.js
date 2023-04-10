//const express = require("express"); //CommonJS

//para agregar ECMAScript modules agrergar "type" : "module" en package.sjon

//importamos express con ECMAScript...

import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import db from "./config/db.js";

//crear la app
const app = express();

//habilitar recibir formularios
app.use(express.urlencoded({ extended: true }));

//habilitar cookie parser
app.use(cookieParser());

//habilitar CSRF
app.use(csrf({ cookie: true }));

//conexion a la base de datos
try {
  await db.authenticate();
  //genera las tablas si no existen
  db.sync();
  console.log("Conexion correcta a la base de datos :D");
} catch (error) {
  console.log(error);
}

//Habilitar pug
app.set("view engine", "pug");
//seteamos las carpeta de las vistas
app.set("vies", "./views");

//carpeta publica
app.use(express.static("public"));

//Routing
//use busca todas las rutas que inicien en '/'
app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);
app.use("/", appRoutes);
app.use("/api", apiRoutes);

//definir puerto y arrancarlo
const port = 3000;
app.listen(port, () => {
  console.log(`El seridor esta funcionando en el puerto ${port}`);
});
