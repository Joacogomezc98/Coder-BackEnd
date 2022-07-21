const { options } = require("./options/mariaDB")
const knex = require("knex")(options);

knex.from("cars").select("*").where({ name: "Audi" }).update({ price: 2000 })
    .then(() => {
        console.log("car updated")
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        knex.destroy();
    })
