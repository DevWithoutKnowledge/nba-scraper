import knex from './knex/knex.js'

// todo add column of date to boxscores and advBoxscores
await knex.raw('UPDATE boxscores SET game_date = games.game_date FROM boxscores AS b ' +
'INNER JOIN games ON b.game_id = games.id')
await knex.raw('UPDATE advBoxscores SET game_date = games.game_date FROM advBoxscores AS a' +
'INNER JOIN games ON a.game_id = games.id')
