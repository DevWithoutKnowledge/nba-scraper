/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
       .createTable('seasons', function(table) {
         table.increments('id')
         table.string('seasonName', 8)
    })
    .createTable('games', function(table) {
        table.increments('id')
        table.string('seasonId').references('id').inTable('seasons')
        table.string('gameName') //in url
        table.date('gameDate')
        table.string('home', 4)
        table.string('away', 4)
        table.boolean('isHomeWin')
    })
    .createTable('boxscores', function(table) {
        table.increments('id')
        table.string('gameId').references('id').inTable('games')
        table.string('playerId', 16)
        table.string('player', 128)
        table.string('mp', 8)
        table.number('fg', 4)
        table.number('fga', 4)
        table.decimal('fg%', 8) //calculate yourself
        table.number('3p', 4)
        table.number('3pa', 4)
        table.decimal('3p%', 8) //calculate yourself
        table.number('ft', 4)
        table.number('fta', 4)
        table.decimal('ft%', 8) //calculate yourself
        table.number('orb', 4)
        table.number('drb', 4)
        table.number('trb', 4)
        table.number('ast', 4)
        table.number('stl', 4)
        table.number('blk', 4)
        table.number('tov', 4)
        table.number('pf', 4)
        table.number('pts', 4)
        table.number('+/-', 4)
    })
    //Think how to loop with Ids. what is the solution
    .createTable('advBoxscores', function(table) {
        table.increments('id')
        table.string('gameId').references('id').inTable('games')
        table.string('playerId', 16)
        table.string('player', 128)
        table.string('mp', 8) //time maybe?? look how time works
        table.decimal('ts%', 8)
        table.decimal('efg%', 8)
        table.decimal('3par', 8)
        table.decimal('ftr', 8)
        table.decimal('orb%', 8)
        table.decimal('drb%', 8) 
        table.decimal('trb%', 8)
        table.decimal('ast%', 8)
        table.decimal('stl%', 8) 
        table.decimal('blk%', 8)
        table.decimal('tov%', 8)
        table.decimal('usg%', 8)
        table.number('ortg', 4)
        table.number('drtg', 4)
        table.float('bpm', 4)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('boxscores')
    .dropTable('advBoxscores')
    .dropTable('games')
    .dropTable('seasons')
};
