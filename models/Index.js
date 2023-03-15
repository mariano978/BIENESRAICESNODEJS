import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

//asociaciones (sequelize crea las llaves foraneas automaticamente)

//Precio.hasOne(Propiedad); //La propiedad tiene 1 precio, pero tambien podemos usar...

Propiedad.belongsTo(Precio, { foreignKey: "precioId" }); //Una propiedad pertenece a un precio
Propiedad.belongsTo(Categoria, { foreignKey: "categoriaId" }); //Una propiedad pertenece a una categoria
Propiedad.belongsTo(Usuario, { foreignKey: "usuarioId" }); //Una propiedad pertenece a un usuario

export { Propiedad, Precio, Categoria, Usuario };
