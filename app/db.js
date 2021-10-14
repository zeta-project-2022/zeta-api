const mysql = require('mysql2/promise')
let connection

// Top-level async function call
(async () => {
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'zeta1'
    })
  } catch (e) {
    // Deal with the fact the chain failed
  }
})()

let wishId = 1

const wishes = [
  {id: 0, title: 'First Wish', description: 'This is the first Wish'},
]

module.exports = {
  wishes: {
    getById: async function(id) {
      const [rows] = await connection.query('SELECT * FROM wishes WHERE id = ?', [id])

      if(rows.length === 0) {
        throw new Error(`No Wish is found with id: ${id}`)
      }

      console.trace(`Get Wish by id: ${id}`, rows)
      return rows
    },
    getAll: async function(from, to, filter) {
      const [rows] = await connection.query('SELECT * FROM wishes')
      console.trace('Get all Wishes', rows)
      return rows
    },
    create: async function(wish, userId) {
      const sql = `
        INSERT INTO wishes (user_id, title, description, images, created)
        VALUES (?, ?, ?, '[]', NOW())
      `
      const [result] = await connection.query(sql, [userId, wish.title, wish.description])
      console.trace(result)
      return result.insertId
    },
    update: async function(wish) {

    },
    delete: async function(id) {

    },
  },
}
