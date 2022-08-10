const { options } = require("./options/mariaDB")
const knex = require("knex")(options);

knex.from("articulos").where({id: 2}).update({stock: 0})
    .then(() => {
        console.log("articulo modificado")
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        knex.destroy();
    })