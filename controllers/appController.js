import { Propiedad, Precio, Categoria } from "../models/Index.js";
import { chalk, stringObj } from "../helpers/logs.js";
import Paginacion from "../helpers/Paginacion.js";
import { Sequelize } from "sequelize";

const index = async (req, res) => {
  //pomise para obtener datos paralelamente
  const [categorias, precios, casas, departamentos] = await Promise.all([
    getAllCategorias(),
    getAllPrecios(),
    getLastCasas(),
    getLastDepartamentos(),
  ]);

  console.log(chalk.yellow(stringObj(casas)));

  res.render("app/index", {
    pagina: "Inicio",
    categorias,
    precios,
    casas,
    departamentos,
    csrfToken: req.csrfToken(),
  });
};

function getAllCategorias() {
  return Categoria.findAll({ raw: true });
}

function getAllPrecios() {
  return Precio.findAll({ raw: true });
}

function getLastCasas() {
  return Propiedad.findAll({
    where: {
      categoriaId: 1,
    },
    order: [["createdAt", "DESC"]],
    limit: 3,
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
}

function getLastDepartamentos() {
  return Propiedad.findAll({
    where: {
      categoriaId: 2,
    },
    order: [["createdAt", "DESC"]],
    limit: 3,
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
}

const categoriasPage = async (req, res) => {
  const { id } = req.params;
  const { usuario } = res;
  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    return res.redirect("/404");
  }

  const { pagina: currentPageNumber } = req.query;
  const cantPropiedades = await countPropiedadesOfCategoria(categoria.id);
  const paginacion = new Paginacion(cantPropiedades);
  paginacion.setCurrentPage(currentPageNumber);

  if (!paginacion.validateNumOfPage()) {
    return res.redirect(`/categorias/${categoria.id}?pagina=1`);
  }

  const propiedades = await findPropertiesByPageOfCategoria(
    paginacion,
    categoria.id
  );

  res.render("app/categoria", {
    pagina:
      categoria.nombre === "Almacen"
        ? `${categoria.nombre}es`
        : `${categoria.nombre}s`,
    propiedades,
    categoriaId: categoria.id,
    cantEnlacesPaginas: paginacion.getAmountOfPages(),
    currentPageNumber,
    limit: paginacion.getLimit(),
    offset: paginacion.getOffset(),
    cantPropiedades,
    csrfToken: req.csrfToken(),
    usuario,
  });
};

const findPropertiesByPageOfCategoria = async (paginator, categoriaId) => {
  const config = {
    limit: paginator.getLimit(),
    offset: paginator.getOffset(),
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
    order: [["updatedAt", "DESC"]],
    where: {
      categoriaId,
    },
  };

  try {
    const propiedades = await Propiedad.findAll(config);
    return propiedades;
  } catch (error) {
    console.log(error);
  }
};

const countPropiedadesOfCategoria = async (categoriaId) => {
  try {
    const cuenta = await Propiedad.count({
      where: {
        categoriaId,
      },
    });
    return cuenta;
  } catch (error) {
    console.log(error);
  }
};

const errorPage = (req, res) => {
  res.render("404", {
    pagina: "No encontrada",
    csrfToken: req.csrfToken(),
  });
};

const buscador = async (req, res) => {
  const { termino } = req.body;

  if (!termino.trim()) {
    return res.redirect("back");
  }

  const propiedades = await Propiedad.findAll({
    where: {
      titulo: {
        [Sequelize.Op.like]: "%" + termino + "%",
      },
    },
    include: [{ model: Precio, as: "precio" }],
  });

  res.render("busqueda", {
    pagina: `Resultados para: ${termino}`,
    propiedades,
    csrfToken: req.csrfToken(),
  });
};

export { index, categoriasPage, errorPage, buscador };
