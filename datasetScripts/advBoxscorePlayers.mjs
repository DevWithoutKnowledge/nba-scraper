import knex from '../knex/knex.js'
import * as fs from 'fs'
import playerSaver from './advPlayerSaver.mjs'
const advBoxscorePlayersScript = async () => {
  const numberOfGames = 10
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
  const teamsObject = await knex('games').whereNotIn('id',
    range(7564, 7714, 1).concat(range(1, 40, 1), range(1172, 1211, 1), range(2315, 2344, 1), range(3627, 3646, 1), range(4939, 4978, 1), range(6248, 6287, 1)))
  const dir = './playersAdvBoxscoreDATASET'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  // i is iteration over each game
  for (let i = 0; i < teamsObject.length; i++) {
    // teamsObject[i] is the game we currently want to save as a file

    // 1. we take boxscore of 1 game (teamsObject[i]) for each team
    const homeCurrentBoxscore = await knex('advBoxscores').where('game_id', teamsObject[i].id).andWhere('mp', '!=', '0').andWhere('team_name', teamsObject[i].home)
      .orderBy([
        { column: 'team_name' },
        { column: 'mp', order: 'desc' }
      ])
    const awayCurrentBoxscore = await knex('advBoxscores').where('game_id', teamsObject[i].id).andWhere('mp', '!=', '0').andWhere('team_name', teamsObject[i].away)
      .orderBy([
        { column: 'team_name' },
        { column: 'mp', order: 'desc' }
      ])
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
    fs.closeSync(fs.openSync(dirgame + '/advBoxscore.json', 'w'))
    await playerSaver(homeCurrentBoxscore, teamsObject[i], numberOfGames, dirgame)
    await playerSaver(awayCurrentBoxscore, teamsObject[i], numberOfGames, dirgame)
  }
}

export default advBoxscorePlayersScript
