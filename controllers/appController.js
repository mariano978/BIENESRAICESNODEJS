import { Propiedad, Precio, Categoria } from "../models/Index.js";
import { chalk, stringObj } from "../helpers/logs.js";
const index = async (req, res) => {
  const [[categorias, precios], casas] = await Promise.all([
    getAllCategoriasPrecios(),
    getAllCasas(),
  ]);

  console.log(chalk.yellow(`${stringObj(casas)}`));
  res.render("app/index", {
    pagina: "Inicio",
    categorias,
    precios,
  });
};

function getAllCategoriasPrecios() {
  const config = { raw: true };
  return Promise.all([Categoria.findAll(config), Precio.findAll(config)]);
}

function getAllCasas() {
  const config = {
    lmit: 3,
    where: {
      categoriaId: 1,
    },
    include: [{ model: Precio, as: "precio" }],
    order: [["createdAt", "DESC"]],
  };
  return Propiedad.findAll(config);
}

const categoriasPage = (req, res) => {};

const errorPage = (req, res) => {};

const buscador = (req, res) => {};

export { index, categoriasPage, errorPage, buscador };
