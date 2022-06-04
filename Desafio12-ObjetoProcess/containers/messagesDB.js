class MessagesDB {
  constructor(db, table) {
    this.db = db,
      this.table = table
  }

  // CREA LA BASE DE DATOS PARA MENSAJES
  async createDB() {
    const knex = require("knex")(this.db);
    try {
      await knex.schema.createTable(this.table, table => {
        table.string("author");
        table.string("text");
        table.date("time")
      });
      console.log("messages table created");
    } catch (err) {
      await knex.schema.dropTable(this.table);
      await knex.schema.createTable(this.table, table => {
        table.string("author");
        table.string("text");
        table.date("time")
      })
      console.log("messages table created");
    } finally {
      knex.destroy()
    }
  };

  // OBTIENE TODOS LOS MENSAJES DE LA DB
  getMessages() {

    const knex = require("knex")(this.db);
    const allMessages = knex.from(this.table).select("*")
      .then((rows) => {
        return rows
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })

    return allMessages

  }
  // GUARDA TODOS LOS MENSAJES Y DEVUELVE EL NUEVO LISTADO
  saveMessage(newMessage) {
    const knex = require("knex")(this.db);

    const newList = knex(this.table).insert(newMessage)
      .then(() => {
        console.log("message added to table")
        const allMessages = knex.from(this.table).select("*")
          .then((rows) => {
            return rows
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            knex.destroy();
          })

        return allMessages
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        knex.destroy();
      })
      return newList
  }

}

module.exports.MessagesDB = MessagesDB
