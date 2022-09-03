/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable('boxscores', table => {
      table.date('game_date')
    })
    .alterTable('advBoxscores', table => {
      table.date('game_date')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('boxscores', table => {
      table.dropColumn('game_date')
    })
    .alterTable('advBoxscores', table => {
      table.dropColumn('game_date')
    })
}
