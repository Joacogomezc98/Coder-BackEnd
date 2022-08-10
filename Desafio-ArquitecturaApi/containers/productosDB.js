const {faker} = require('@faker-js/faker')
class ProductosDB {
  constructor(db, table) {
    this.db = db,
      this.table = table
  }

  async createDB() {
    const knex = require("knex")(this.db);
    try {
      await knex.schema.createTable(this.table, table => {
        table.increments("id");
        table.string("title");
        table.float("price");
        table.string("thumbnail")
      });
      console.log("table products created");
    } catch (err) {
      await knex.schema.dropTable(this.table);
      await knex.schema.createTable(this.table, table => {
        table.increments("id");
        table.string("title");
        table.float("price");
        table.string("thumbnail")
      })
      console.log("table products created");
    } finally {
      knex.destroy()
    }
  };

  insertProducts() {
    const initialProducts = [
      {
        title: "SMIRNOFF ICE 473ml",
        price: 180,
        thumbnail: "http://www.puroescabio.com.ar/web/image/product.template/74947/image_256/%5B4860%5D%20SMIRNOFF%20ICE%20473ml?unique=1e17d14",
      },
      {
        title: "SMIRNOFF 750ml",
        price: 790,
        thumbnail: "http://www.puroescabio.com.ar/web/image/product.template/52280/image_256/%5B2169%5D%20SMIRNOFF%20750ml?unique=1e17d14",
      },
      {
        title: "SMIRNOFF WATERMELON 750ml",
        price: 890,
        thumbnail: "http://www.puroescabio.com.ar/web/image/product.template/52617/image_256/%5B2469%5D%20SMIRNOFF%20WATERMELON%20750ml%20?unique=1e17d14",
      },
      {
        title: "SMIRNOFF ICE GREENAPPLE 473ml",
        price: 180,
        thumbnail: "http://www.puroescabio.com.ar/web/image/product.template/74948/image_256/%5B4859%5D%20SMIRNOFF%20ICE%20GREENAPPLE%20473ml?unique=1e17d14",
      }
    ]

    const knex = require("knex")(this.db);

    knex(this.table).insert(initialProducts)
      .then(() => {
        console.log("products added to table")
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })

  }

  getAll() {
    // Devuelve un array con todos los objetos presentes en el archivo
    const knex = require("knex")(this.db);
    const allProducts = knex.from(this.table).select("*")
      .then((rows) => {
        return rows
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })

    return allProducts
  }

  getById(id) {
    //Recibe un id y debe devolver el objeto con ese id o null si no existe.
    const knex = require("knex")(this.db);
    const productById = knex.from(this.table).select("*").where("id", id)
      .then((rows) => {
        return rows
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })

    return productById
  }
  saveProduct(newProduct) {

    const knex = require("knex")(this.db);

    knex(this.table).insert(newProduct)
      .then(() => {
        console.log("products added to table")
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })
  }

  modifyProduct(modProduct, id) {
    const knex = require("knex")(this.db);

    knex.from(this.table).select("*").where("id", id).update(modProduct)
      .then(() => {
        console.log("product updated")
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })


  }

  deleteProd(id) {
    const knex = require("knex")(this.db);

    knex.from(this.table).select("*").where("id", id).del()
      .then(() => {
        console.log("product deleted")
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })
  }

  // SAMPLE PRODUCTS WITH FAKER
  async getSample() {
    const users = []
    for (let i = 0; i < 5; i++) {
      const user = {
        title: faker.commerce.product(),
        price: faker.commerce.price(1000,5000),
        thumbnail: faker.image.food(320, 110, true)
      }
      users.push(user)
    }
    return users
  }
}


module.exports.ProductosDB = ProductosDB
