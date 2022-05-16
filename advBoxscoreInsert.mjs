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
          ts_pct: 0,
          efg_pct: 0,
          three_par: 0,
          ftr: 0,
          orb_pct: 0,
          drb_pct: 0,
          trb_pct: 0,
          ast_pct: 0,
          stl_pct: 0,
          blk_pct: 0,
          tov_pct: 0,
          usg_pct: 0,
          ortg: 0,
          drtg: 0,
          bpm: 0
        }
      } else {
        jsonStats = {
          game_id: gameId,
          team_name: team,
          player_id: boxscore[i][0].match(/(?<=\/.\/)(.*?)(?=\.html)/gm),
          player_name: boxscore[i][0].match(/(?<=\"\>)(.*?)(?=\<)/gm),
          mp: boxscore[i][1],
          ts_pct: boxscore[i][2],
          efg_pct: boxscore[i][3],
          three_par: boxscore[i][4],
          ftr: boxscore[i][5],
          orb_pct: boxscore[i][6],
          drb_pct: boxscore[i][7],
          trb_pct: boxscore[i][8],
          ast_pct: boxscore[i][9],
          stl_pct: boxscore[i][10],
          blk_pct: boxscore[i][11],
          tov_pct: boxscore[i][12],
          usg_pct: boxscore[i][13],
          ortg: boxscore[i][14],
          drtg: boxscore[i][15],
          bpm: boxscore[i][16]
        }
      }
      await knex('advBoxscores').insert(jsonStats).catch(async function(e) {
        console.error(e)
        throw e
      })
    } //End of for statement boxscore
 }

 export default boxscoreSave