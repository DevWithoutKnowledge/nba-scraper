import mergePlayer from './jsObjectMerger.mjs'
import knex from '../knex/knex.js'
import * as fs from 'fs'

const playerSaver = async (currentBoxscore, teamsObject, numberOfGames, dirgame) => {
  const playersId = currentBoxscore.map(function (boxscoreRow) {
    return boxscoreRow.player_id
  })
  const benchPlayers = []
  // j is iteration over each player
  for (let j = 0; j < playersId.length; j++) {
    // 3. loop. for each player we take last 10 boxscores that date is older than teamsObject[i]
    const playerBoxscores = await knex('boxscores as b')
      .select('b.*', 'g.game_date')
      .join('games as g', 'g.id', 'b.game_id')
      .where('g.game_date', '<', teamsObject.game_date)
      .andWhere('player_id', playersId[j])
      .andWhere('mp', '!=', '0')
      .orderBy('g.game_date', 'desc')
      .limit(numberOfGames)

    let playerAverage = null

    if (playerBoxscores.length === 0) {
      playerAverage = currentBoxscore[j]
      // hardcoded stats for player with no previous game history
      playerAverage.fg = '2.000'
      playerAverage.fga = '4.000'
      playerAverage.three_p = '0.400'
      playerAverage.three_pa = '1.200'
      playerAverage.ft = '0.900'
      playerAverage.fta = '1.200'
      playerAverage.orb = '0.600'
      playerAverage.drb = '1.700'
      playerAverage.trb = '2.300'
      playerAverage.ast = '1.200'
      playerAverage.stl = '0.400'
      playerAverage.blk = '0.250'
      playerAverage.tov = '0.700'
      playerAverage.pf = '1.000'
      playerAverage.pts = '6.000'
    } else {
      // average of games player played
      playerAverage = mergePlayer(playerBoxscores)
    }
    // adjusting stats that may have problem when making average in loop, because of their numeric format
    playerAverage.game_id = teamsObject.id
    playerAverage.team_name = currentBoxscore[j].team_name
    playerAverage.fg_pct = (playerAverage.fg / playerAverage.fga).toFixed(3)
    playerAverage.three_p_pct = (playerAverage.three_p / playerAverage.three_pa).toFixed(3)
    playerAverage.ft_pct = (playerAverage.ft / playerAverage.fta).toFixed(3)
    // deleting columns that are not important for Neural Network. May be changed if
    delete playerAverage.id
    delete playerAverage.mp
    delete playerAverage.plus_minus
    delete playerAverage.game_date

    // after 6 players every player counts as one person
    if (j > 5 && j < playersId.length - 1) {
      benchPlayers.push(playerAverage)
    } else if (j === playersId.length - 1) {
      benchPlayers.push(playerAverage)
      playerAverage = mergePlayer(benchPlayers)
      // adjusting stats that may have problem when making average in loop, because of their numeric format
      playerAverage.game_id = teamsObject.id
      playerAverage.team_name = currentBoxscore[j].team_name
      playerAverage.player_id = 'bench' + playerAverage.team_name
      playerAverage.player_name = 'Bench of ' + playerAverage.team_name
      playerAverage.fg_pct = (playerAverage.fg / playerAverage.fga).toFixed(3)
      playerAverage.three_p_pct = (playerAverage.three_p / playerAverage.three_pa).toFixed(3)
      playerAverage.ft_pct = (playerAverage.ft / playerAverage.fta).toFixed(3)
      console.log(playerAverage)
      // saving boxscore file
      const data = fs.readFileSync(dirgame + '/boxscore.json', 'utf8')
      let list = (data.length) ? JSON.parse(data) : []
      if (list instanceof Array) {
        list.push(playerAverage)
      } else { list = [playerAverage] }
      fs.writeFileSync(dirgame + '/boxscore.json', JSON.stringify(list))
    } else {
      console.log(playerAverage)
      // saving boxscore file

      const data = fs.readFileSync(dirgame + '/boxscore.json')
      let list = (data.length) ? JSON.parse(data) : []
      if (list instanceof Array) {
        list.push(playerAverage)
      } else { list = [playerAverage] }
      fs.writeFileSync(dirgame + '/boxscore.json', JSON.stringify(list))
    }
  }
}

export default playerSaver
