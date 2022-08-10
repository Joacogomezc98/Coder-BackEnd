const { options } = require("./options/mariaDB")
const knex = require("knex")(options);

//SELECT * FROM cars
knex.from("articulos").select("*")
    .then((rows) => {
        console.log(rows)
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        knex.destroy();
    })