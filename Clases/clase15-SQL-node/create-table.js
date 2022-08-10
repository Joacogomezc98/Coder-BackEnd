const {options} = require("./options/mariaDB");
const knex = require("knex")(options);

(async () => {
    try{
        await knex.schema.createTable("cars", table => {
            table.increments("id");
            table.string("name");
            table.integer("price");
        });
        console.log("table cars created");
    } catch (err){
        console.log(err)
    }finally {
        knex.destroy()
    }
})();