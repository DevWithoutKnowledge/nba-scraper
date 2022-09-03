import scheduleScraper from './scraping/scheduleUrlScraper.mjs'
import gamesUrlScraper from './scraping/gamesUrlScraper.mjs'
import knex from './knex/knex.js'
import { Console } from 'console'
import * as fs from 'fs'
import gameScrapAndSave from './scraperAndSaver.mjs'
import pLimit from 'p-limit'

const scraperObject = {
  url: 'https://www.basketball-reference.com/leagues/',

  async scraper (browser) {
    const myLogger = new Console({
      stdout: fs.createWriteStream('normalStdout.txt'),
      stderr: fs.createWriteStream('errStdErr.txt')
    })

    const page = await browser.newPage()
    console.log(`Navigate to ${this.url} ...`)

    await page.goto(this.url)
    await page.waitForSelector('.table_wrapper')
    // get links to nba seasons
    const seasonUrls = await page.$$eval('tr[data-row] > th > a',
      links => links.slice(1, 8).map((a) => a.href)
    )
    // one iteration for one whole season
    for (const seasonUrl of seasonUrls) {
      // open season
      const seasonInfo = {
        season_name: seasonUrl.match(/\d{4}/gm)
      }
      // save season to db
      const seasonId = await knex('seasons').insert(seasonInfo).returning('id')

      // schedule urls (months) for only one season
      const currentSeasonUrls = await scheduleScraper(seasonUrl, browser)
      // save games urls of the season
      for (const scheduleLink of currentSeasonUrls) {
        const currentScheduleUrls = await gamesUrlScraper(scheduleLink, browser)

        // number of games saved
        const limit = pLimit(4)

        const promises = currentScheduleUrls.map(url => {
          // wrap the function we are calling in the limit function we defined above
          // if not working change back to seasonId[0]['id']
          return limit(async () => await gameScrapAndSave(myLogger, browser, seasonId[0].id, url))
        })
        // new loop (for game in games) using Promise.all
        await (async () => {
          await Promise.all(promises)
        })()
      }
    }
    await browser.close()
  }
}

export default browser => scraperObject.scraper(browser)
