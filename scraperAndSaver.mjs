import gamesDataScraper from './scraping/gamesDataScraper.mjs'
import boxscoreDataScraper from './scraping/boxscoreDataScraper.mjs'
import advancedBoxscoreDataScraper from './scraping/advBoxscoreDataScraper.mjs'
import boxscoreInsert from './inserting/boxscoreInsert.mjs'
import advancedBoxscoreInsert from './inserting/advBoxscoreInsert.mjs'
import knex from './knex/knex.js'

const scrapAndSave = async (myLogger, browser, seasonId, game) => {
  console.log('current link: ' + game + '\n')
  // scrap game of the season
  const gamePage = await browser.newPage()
  await gamePage.goto(game)

  const gameInfo = await gamesDataScraper(gamePage, game, seasonId)
  // save  game of the season to db
  await knex('games').insert(gameInfo).returning('id').then(async function (gameId) {
    // scrap boxscore
    const boxscoreHome = await boxscoreDataScraper(gamePage, gameInfo.home)
    const boxscoreAway = await boxscoreDataScraper(gamePage, gameInfo.away)
    const advBoxscoreHome = await advancedBoxscoreDataScraper(gamePage, gameInfo.home)
    const advBoxscoreAway = await advancedBoxscoreDataScraper(gamePage, gameInfo.away)

    await boxscoreInsert(boxscoreHome, gameInfo.home, gameId[0]['id'])
    await boxscoreInsert(boxscoreAway, gameInfo.away, gameId[0]['id'])
    await advancedBoxscoreInsert(advBoxscoreHome, gameInfo.home, gameId[0]['id'])
    await advancedBoxscoreInsert(advBoxscoreAway, gameInfo.away, gameId[0]['id'])
  }).catch(async function (e) {
    await gamePage.close()
    myLogger.error(game + ' ' + new Date() + ' \n')
    myLogger.error(e)
    console.error(e)
    return e
  })

  await gamePage.close()
  return ('success: ' + game)
}

export default scrapAndSave
