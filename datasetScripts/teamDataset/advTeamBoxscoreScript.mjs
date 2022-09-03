import knex from '../../knex/knex.js'
import * as fs from 'fs'
import teamSaver from './advTeamSaver.mjs'

const advBoxscoreTeamScript = async () => {
  // TODO change file name to players boxscore file and create 3 more scripts [team boxscore, players advanced, team advanced] 10 games = 20 teams 30team x 10 games = 300
  const numberOfGames = 10
  // 7564-7714
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
  const teamsObject = await knex('games').whereNotIn('id',
    range(7564, 7714, 1).concat(range(1, 40, 1), range(1172, 1211, 1), range(2315, 2344, 1), range(3627, 3646, 1), range(4939, 4978, 1), range(6248, 6287, 1)))
  const dir = './teamsAdvBoxscoreDATASET'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  // i is iteration over each game
  for (let i = 0; i < teamsObject.length; i++) {
    // teamsObject[i] is the game we currently want to save as a file
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

    const homeGameList = await knex('games').where('game_date', '<', teamsObject[i].game_date).andWhere(function () {
      this.where('home', teamsObject[i].home).orWhere('away', teamsObject[i].home)
    }).orderBy('game_date', 'desc').limit(numberOfGames)

    const awayGameList = await knex('games').where('game_date', '<', teamsObject[i].game_date).andWhere(function () {
      this.where('home', teamsObject[i].away).orWhere('away', teamsObject[i].away)
    }).orderBy('game_date', 'desc').limit(numberOfGames)

    await teamSaver(homeGameList, teamsObject[i].home, dirgame, teamsObject[i].id)
    await teamSaver(awayGameList, teamsObject[i].away, dirgame, teamsObject[i].id)
  }
}
export default advBoxscoreTeamScript
