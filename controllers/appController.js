const index = (req, res) => {
  res.render("app/index", {
    pagina: "Inicio",
  });
};

const categoriasPage = (req, res) => {};

const errorPage = (req, res) => {};

const buscador = (req, res) => {};

export { index, categoriasPage, errorPage, buscador };
