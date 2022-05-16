// // Update with your config settings.
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);

// // 👇️ "/home/john/Desktop/javascript"
// const __dirname = path.dirname(__filename);
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: '5432',
      user: 'postgres',
      password: 'root',
      database: 'nba_db'
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  }

}