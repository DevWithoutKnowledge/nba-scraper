import knex from './knex/knex.js'

let boxscoreSave = async (boxscore, team, gameId) => {
    
    // loop for each boxscore row
    for (let i = 1; i < boxscore.length - 1; i++) {
      let jsonStats = {}
      //each player stat
      if (boxscore[i][0] === 'Reserves') {
          continue
      }
      else if (boxscore[i][1] === 'Did Not Play' || boxscore[i][1] === 'Did Not Dress' || boxscore[i][1] === 'Not With Team' || boxscore[i][i] === 'Player Suspended') {
        jsonStats = {
          game_id: gameId, //TODO: first create game in database and select it somehow
          team_name: team,
          player_id: boxscore[i][0].match(/(?<=\/.\/)(.*?)(?=\.html)/gm),
          player_name: boxscore[i][0].match(/(?<=\"\>)(.*?)(?=\<)/gm),
          mp: '0',
          fg: 0,
          fga: 0,
          fg_pct: 0,
          three_p: 0,
          three_pa: 0,
          three_p_pct: 0,
          ft: 0,
          fta: 0,
          ft_pct: 0,
          orb: 0,
          drb: 0,
          trb: 0,
          ast: 0,
          stl: 0,
          blk: 0,
          tov: 0,
          pf: 0,
          pts: 0,
          plus_minus: '0'
        }
      } else {
        jsonStats = {
          game_id: gameId,
          team_name: team,
          player_id: boxscore[i][0].match(/(?<=\/.\/)(.*?)(?=\.html)/gm),
          player_name: boxscore[i][0].match(/(?<=\"\>)(.*?)(?=\<)/gm),
          mp: boxscore[i][1],
          fg: boxscore[i][2],
          fga: boxscore[i][3],
          fg_pct: boxscore[i][4],
          three_p: boxscore[i][5],
          three_pa: boxscore[i][6],
          three_p_pct: boxscore[i][7],
          ft: boxscore[i][8],
          fta: boxscore[i][9],
          ft_pct: boxscore[i][10],
          orb: boxscore[i][11],
          drb: boxscore[i][12],
          trb: boxscore[i][13],
          ast: boxscore[i][14],
          stl: boxscore[i][15],
          blk: boxscore[i][16],
          tov: boxscore[i][17],
          pf: boxscore[i][18],
          pts: boxscore[i][19],
          plus_minus: boxscore[i][20]
        }
      }
      await knex('boxscores').insert(jsonStats).catch(async function(e) {
        console.error(e)
        throw e
      })
    } //End of for statement boxscore
 }

 export default boxscoreSave