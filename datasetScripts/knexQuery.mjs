import knex from '../knex/knex.js'
import * as fs from 'fs'
import playerSaver from './playerSaver.mjs'

// TODO change file name to players boxscore file and create 3 more scripts [team boxscore, players advanced, team advanced]
const numberOfGames = 10
const teamsObject = await knex('games')
const dir = './playersBoxscoreDATASET'

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}
// i is iteration over each game
for (let i = 0; i < teamsObject.length; i++) {
  // teamsObject[i] is the game we currently want to save as a file

  // 1. we take boxscore of 1 game (teamsObject[i]) for each team
  const homeCurrentBoxscore = await knex('boxscores').where('game_id', teamsObject[i].id).andWhere('mp', '!=', '0').andWhere('team_name', teamsObject[i].home)
    .orderBy([
      { column: 'team_name' },
      { column: 'mp', order: 'desc' }
    ])
  const awayCurrentBoxscore = await knex('boxscores').where('game_id', teamsObject[i].id).andWhere('mp', '!=', '0').andWhere('team_name', teamsObject[i].away)
    .orderBy([
      { column: 'team_name' },
      { column: 'mp', order: 'desc' }
    ])
  // const currentBoxscore = [...homeCurrentBoxscore, ...awayCurrentBoxscore]
  // console.log(currentBoxscore)
  // 2. we take all players ids from this game
  // const playersId = currentBoxscore.map(function (boxscoreRow) {
  //   return boxscoreRow.player_id
  // })
  // saving game as file
  const dirgame = dir + '/game' + teamsObject[i].id + teamsObject[i].home + '_' + teamsObject[i].away
  if (!fs.existsSync(dirgame)) {
    fs.mkdirSync(dirgame, { recursive: true })
  }
  const gameJson = JSON.stringify(teamsObject[i])
  fs.writeFile(dirgame + '/gameinfo.json', gameJson, function (err) {
    if (err) {
      console.log(err)
    }
  })
  fs.closeSync(fs.openSync(dirgame + '/boxscore.json', 'w'))
  await playerSaver(homeCurrentBoxscore, teamsObject[i], numberOfGames, dirgame)
  await playerSaver(awayCurrentBoxscore, teamsObject[i], numberOfGames, dirgame)
}

process.exit()
