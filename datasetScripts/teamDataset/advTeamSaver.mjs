import mergeBoxscore from '../jsObjectMerger.mjs'
import knex from '../../knex/knex.js'
import * as fs from 'fs'
import mergeTeam from './teamMerger.mjs'

const teamSaver = async (gameList, teamName, dirgame, gameId) => {
  // j is iteration over each player
  let teamAverage = null
  const gamesSum = []
  for (let j = 0; j < gameList.length; j++) {
    // 3. loop. for each game we take boxscores and sum it up
    const teamGameBoxscore = await knex('advBoxscores').where('game_id', gameList[j].id).andWhere('team_name', teamName)

    // Sum of boxscore rows
    teamAverage = mergeTeam(teamGameBoxscore)

    // adjusting stats that may have problem when making average in loop, because of their numeric format
    teamAverage.game_id = gameList[j].id
    teamAverage.team_name = teamName
    teamAverage.player_id = 'team' + teamName
    teamAverage.player_name = 'Team name: ' + teamName
    // deleting columns that are not important for Neural Network. May be changed if
    delete teamAverage.id
    delete teamAverage.mp
    gamesSum.push(teamAverage)
  }
  // saving boxscore file
  teamAverage = mergeBoxscore(gamesSum)
  teamAverage.team_name = teamName
  teamAverage.player_id = 'team' + teamName
  teamAverage.player_name = 'Team name: ' + teamName
  teamAverage.game_id = gameId
  console.log(teamAverage)

  const data = fs.readFileSync(dirgame + '/advBoxscore.json')
  let list = (data.length) ? JSON.parse(data) : []
  if (list instanceof Array) {
    list.push(teamAverage)
  } else { list = [teamAverage] }
  fs.writeFileSync(dirgame + '/advBoxscore.json', JSON.stringify(list))
}

export default teamSaver
