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
    const playerBoxscores = await knex('advBoxscores as b')
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
      playerAverage.ts_pct = '0.541'
      playerAverage.efg_pct = '0.512'
      playerAverage.three_par = '0.411'
      playerAverage.ftr = '0.251'
      playerAverage.orb_pct = '5.142'
      playerAverage.drb_pct = '12.142'
      playerAverage.trb_pct = '9.004'
      playerAverage.ast_pct = '11.853'
      playerAverage.stl_pct = '1.283'
      playerAverage.blk_pct = '1.535'
      playerAverage.tov_pct = '9.924'
      playerAverage.usg_pct = '18.632'
      playerAverage.ortg = '110.000'
      playerAverage.drtg = '110.000'
      playerAverage.bpm = '-1.642'
    } else {
      // average of games player played
      playerAverage = mergePlayer(playerBoxscores)
    }
    // adjusting stats that may have problem when making average in loop, because of their numeric format
    playerAverage.game_id = teamsObject.id
    playerAverage.team_name = currentBoxscore[j].team_name
    // deleting columns that are not important for Neural Network. May be changed if
    delete playerAverage.id
    delete playerAverage.mp
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
      console.log(playerAverage)
      // saving boxscore file
      const data = fs.readFileSync(dirgame + '/advBoxscore.json', 'utf8')
      let list = (data.length) ? JSON.parse(data) : []
      if (list instanceof Array) {
        list.push(playerAverage)
      } else { list = [playerAverage] }
      fs.writeFileSync(dirgame + '/advBoxscore.json', JSON.stringify(list))
    } else {
      console.log(playerAverage)
      // saving boxscore file

      const data = fs.readFileSync(dirgame + '/advBoxscore.json')
      let list = (data.length) ? JSON.parse(data) : []
      if (list instanceof Array) {
        list.push(playerAverage)
      } else { list = [playerAverage] }
      fs.writeFileSync(dirgame + '/advBoxscore.json', JSON.stringify(list))
    }
  }
}

export default playerSaver
