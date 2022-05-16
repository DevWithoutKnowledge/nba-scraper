import scheduleScraper from './scheduleUrlScraper.mjs'
import gamesUrlScraper from './gamesUrlScraper.mjs'
import knex from './knex/knex.js'
import { Console } from 'console'
import * as fs from 'fs'
import gameScrapAndSave from './scraperAndSaver.mjs'
import pLimit from 'p-limit'

const scraperObject = {
  url: "https://www.basketball-reference.com/leagues/",

  async scraper(browser) {
    const myLogger = new Console({
      stdout: fs.createWriteStream("normalStdout.txt"),
      stderr: fs.createWriteStream("errStdErr.txt"),
    })

    let page = await browser.newPage()
    console.log(`Navigate to ${this.url} ...`)

    await page.goto(this.url)
    await page.waitForSelector('.table_wrapper')

    //get links to nba seasons
    let seasonUrls = await page.$$eval('tr[data-row] > th > a',
      links => links.slice(1, 8).map((a) => a.href)
    )

    for (let seasonUrl of seasonUrls) { // one iteration for one whole season
      // let scheduleUrls = []
      // let gameUrls = []
      //open season
      let seasonInfo = {
        season_name: seasonUrl.match(/\d{4}/gm)
      }
      //save season to db
      let seasonId = await knex('seasons').insert(seasonInfo).returning('id')

      let currentSeasonUrls = await scheduleScraper(seasonUrl, browser) //schedule urls (months) for only one season 
      // scheduleUrls.push(currentSeasonUrls)

      //save games urls of the season 
      for (let scheduleLink of currentSeasonUrls) {
        const currentScheduleUrls = await gamesUrlScraper(scheduleLink, browser)
        //console.log("dataScraper: " + currentScheduleUrls[scheduleLink])
        //gameUrls.push(currentScheduleUrls) 
        const limit = pLimit(3)
        let promises = currentScheduleUrls.map(url => {
          // wrap the function we are calling in the limit function we defined above
          return limit(() => gameScrapAndSave(myLogger, browser, seasonId, url));
        })
          //new loop (for game in games) using Promise.all
          (async () => {
            const result = await Promise.all(promises);
            console.log(result);
          })()
      }
      //reset gameUrls, schedule variable after everything
      scheduleUrls = []
      gameUrls = []
    }
    await browser.close()
  }
}

export default browser => scraperObject.scraper(browser)