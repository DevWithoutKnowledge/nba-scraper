const scheduleScraper = require('./scheduleScraper')
const gamesScraper = require('./gamesScraper')
const scraperObject = {
    url: "https://www.basketball-reference.com/leagues/",
    
    async scraper(browser){   
        let page = await browser.newPage()
        console.log(`Navigate to ${this.url} ...`)

        // await page.goto(this.url)
        // await page.waitForSelector('.table_wrapper')

        // //get links to nba seasons
        // let seasonUrls = await page.$$eval('tr[data-row] > th > a', 
        // links => links.slice(1, 8).map((a)=>a.href)
        // )
        // //loop through seasons to get schedule urls
        // let scheduleUrls = []
        // for(link in seasonUrls) {
        //     let currentSeasonUrls = await scheduleScraper(seasonUrls[link], browser)
        //     scheduleUrls.push(currentSeasonUrls)     
        // }
        // console.log(scheduleUrls[0])
       
        // //loop through schedules to get box score urls
        // let gamesUrls = []
        // for(links in scheduleUrls) {

        //     if (!scheduleUrls.hasOwnProperty(links)) continue

        //     let objLinks = scheduleUrls[links]
        //         for (link in objLinks) {
                    
        //             let currentScheduleUrls = await gamesScraper(objLinks[link], browser)
        //             gamesUrls.push(currentScheduleUrls)
                    
        //         } 
        //         //console.log(gamesUrls[0]) 
        // }

        
        // //final loop to get all games as we want
        // let scrapedGames = []
        // console.log(gamesUrls[0][0])

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const testUrl = "https://www.basketball-reference.com/boxscores/202012220LAL.html"
       
        let gameScraper = (link) => new Promise(async(resolve, reject) => {
            let dataObj = {}
            let boxscore = {}
            let gamePage = await browser.newPage()
        
            await gamePage.goto(link)
            //await gamePage.waitForSelector('#schedule')
            dataObj['gameName'] = link.slice(-17,-5)
            dataObj['gameDate'] = await gamePage.$eval('.scorebox_meta > div:first-child', text => text.textContent)
            dataObj['gameDate'] = new Date(dataObj['gameDate'])

            let teams = await gamePage.$$eval('.scorebox > div > div > strong > a',
            links => links.map((a)=>a.href))
            dataObj['home'] = teams[0].slice(-13,-10)
            dataObj['away'] = teams[1].slice(-13,-10)

            let points = await gamePage.$$eval('.scores > div.score',
            score => score.map((div)=>div.textContent))
            dataObj['isHomeWin'] = true
            if(points[0] > points[1]) dataObj['isHomeWin'] = false
            resolve(dataObj)


            await gamePage.close()
        })
       
        
        let test = (link, gameInfo) => new Promise(async(resolve, reject) => {
            let gamePage = await browser.newPage()
            await gamePage.goto(link)
            const awayTeamTableId = 'box-' + gameInfo['away'] + '-game-basic'

                const boxscore = await gamePage.evaluate((tId) => {
                let data = [];
                let table = document.getElementById(tId);
          
                for (var i = 1; i < table.rows.length; i++) {
                  let objCells = table.rows.item(i).cells;
          
                  let values = [];
                  for (var j = 0; j < objCells.length; j++) {
                    let text = objCells.item(j).innerHTML;
                    values.push(text);
                  }
                  let d = { i, values };
                  data.push(d);
                }
          
                return data;
              }, awayTeamTableId);
            resolve(boxscore)


            await gamePage.close()
        })

        let testGame = await gameScraper(testUrl)
        let boxscore = await test(testUrl, testGame)
        console.log(boxscore)
        console.log(testGame)
    } 
}

module.exports = scraperObject