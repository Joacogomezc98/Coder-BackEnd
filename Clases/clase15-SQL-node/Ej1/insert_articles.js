const { options } = require("./options/mariaDB")
const knex = require("knex")(options);

const articulos = [
    {
        nombre: "Coca-Cola",
        codigo: "COCA",
        precio: 200,
        stock: 100
    },
    {
        nombre: "Coca-Cola",
        codigo: "COCA",
        precio: 200,
        stock: 100
    }, 
    {
        nombre: "Coca-Cola",
        codigo: "COCA",
        precio: 200,
        stock: 100
    }, 
    {
        nombre: "Coca-Cola",
        codigo: "COCA",
        precio: 200,
        stock: 100
    }, 
    {
        nombre: "Coca-Cola",
        codigo: "COCA",
        precio: 200,
        stock: 100
    },
]

// Insert cars to DB

knex("articulos").insert(articulos)
    .then(() => {
        console.log("articles added to table")
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        knex.destroy();
    })