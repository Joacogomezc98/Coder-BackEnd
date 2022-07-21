const { options } = require("./options/mariaDB")
const knex = require("knex")(options);

//SELECT * FROM cars
knex.from("cars").select("*").whereIn("name", ["Audi", "BMW", "Mercedes"]).orderBy("price", "desc")
    .then((rows) => {
        console.log(rows)
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        knex.destroy();
    })