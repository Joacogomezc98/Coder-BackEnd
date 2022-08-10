const { options } = require("./options/mariaDB")
const knex = require("knex")(options);

const cars = [
    {name: "Ferrari", price: 200000},
    {name: "Lamborghini", price: 300000},
    {name: "Bugatti", price: 400000},
    {name: "Porche", price: 600000},
    {name: "Mercedes", price: 100000},
    {name: "Audi", price: 100000}
]

// Insert cars to DB

knex("cars").insert(cars)
    .then(() => {
        console.log("Cars added to table")
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        knex.destroy();
    })