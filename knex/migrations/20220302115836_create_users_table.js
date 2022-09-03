/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('seasons', function (table) {
      table.increments('id')
      table.string('season_name', 8)
    })
    .createTable('games', function (table) {
      table.increments('id')
      table.integer('season_id').references('id').inTable('seasons')
      table.string('game_name') // in url
      table.date('game_date')
      table.string('home', 4)
      table.string('away', 4)
      table.boolean('is_home_win')
    })
    .createTable('boxscores', function (table) {
      table.increments('id')
      table.integer('game_id').references('id').inTable('games') //
      table.string('team_name', 4)
      table.string('player_id', 16)
      table.string('player_name', 128)
      table.string('mp', 8)
      table.float('fg', 8)
      table.float('fga', 8)
      table.decimal('fg_pct', 8, 3) // calculate yourself
      table.float('three_p', 8)
      table.float('three_pa', 8)
      table.decimal('three_p_pct', 8, 3) // calculate yourself
      table.float('ft', 8)
      table.float('fta', 8)
      table.decimal('ft_pct', 8, 3) // calculate yourself
      table.float('orb', 8)
      table.float('drb', 8)
      table.float('trb', 8)
      table.float('ast', 8)
      table.float('stl', 8)
      table.float('blk', 8)
      table.float('tov', 8)
      table.float('pf', 8)
      table.float('pts', 8)
      table.string('plus_minus', 8)
    })
    // Think how to loop with _ids. what is the solution
    .createTable('advBoxscores', function (table) {
      table.increments('id')
      table.integer('game_id').references('id').inTable('games')
      table.string('team_name', 4)
      table.string('player_id', 16)
      table.string('player_name', 128)
      table.string('mp', 8) // time maybe?? look how time works
      table.decimal('ts_pct', 8, 3)
      table.decimal('efg_pct', 8, 3)
      table.decimal('three_par', 8, 3)
      table.decimal('ftr', 8, 3)
      table.decimal('orb_pct', 8, 3)
      table.decimal('drb_pct', 8, 3)
      table.decimal('trb_pct', 8, 3)
      table.decimal('ast_pct', 8, 3)
      table.decimal('stl_pct', 8, 3)
      table.decimal('blk_pct', 8, 3)
      table.decimal('tov_pct', 8, 3)
      table.decimal('usg_pct', 8, 3)
      table.float('ortg', 8, 3)
      table.float('drtg', 8, 3)
      table.float('bpm', 8, 3)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('boxscores')
    .dropTable('advBoxscores')
    .dropTable('games')
    .dropTable('seasons')
}
