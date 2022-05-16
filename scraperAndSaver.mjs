import gamesDataScraper from './gamesDataScraper.mjs'
import boxscoreDataScraper from './boxscoreDataScraper.mjs'
import advancedBoxscoreDataScraper from './advBoxscoreDataScraper.mjs'
import boxscoreInsert from './boxscoreInsert.mjs'
import advancedBoxscoreInsert from './advBoxscoreInsert.mjs'
import knex from './knex/knex.js'

let scrapAndSave = (myLogger, browser, seasonId,  game) => new Promise(async(resolve, reject) => {

    console.log("current link: " + game + '\n')
    //scrap game of the season
    let gamePage = await browser.newPage()
    await gamePage.goto(game)

    let gameInfo = await gamesDataScraper(gamePage, game, seasonId[0]['id'])
    //save  game of the season to db
    await knex('games').insert(gameInfo).returning('id').then(async function (gameId) {
      //scrap boxscore
      let boxscoreHome = await boxscoreDataScraper(gamePage, gameInfo['home'])
      let boxscoreAway = await boxscoreDataScraper(gamePage, gameInfo['away'])
      let advBoxscoreHome = await advancedBoxscoreDataScraper(gamePage, gameInfo['home'])
      let advBoxscoreAway = await advancedBoxscoreDataScraper(gamePage, gameInfo['away'])
      //save boxscore to db
      //MAKE LOGGER TO FIND ERRORS
      await boxscoreInsert(boxscoreHome, gameInfo['home'], gameId[0]['id'])
      await boxscoreInsert(boxscoreAway, gameInfo['away'], gameId[0]['id'])
      await advancedBoxscoreInsert(advBoxscoreHome, gameInfo['home'], gameId[0]['id'])
      await advancedBoxscoreInsert(advBoxscoreAway, gameInfo['away'], gameId[0]['id'])

    }).catch(async function(e) {
      await gamePage.close()
      myLogger.error(game + ' ' + new Date() + ' \n')
      myLogger.error(e)
      console.error(e)
      reject(e)
    })
    await gamePage.close()
    resolve('success: ' + game)
})
export default scrapAndSave