
const scraperObject = {
    url: "https://www.basketball-reference.com/leagues/",
    
    async scraper(browser){   
        let page = await browser.newPage()
        console.log(`Navigate to ${this.url} ...`)

        await page.goto(this.url)
        await page.waitForSelector('.table_wrapper')

        //get links to nba seasons
        let seasonUrls = await page.$$eval('tr[data-row] > th > a', 
        links => links.slice(1, 8).map((a)=>a.href)
        )

        //Function for season loop
        let getScheduleUrls = (link) => new Promise(async(resolve, reject) => {
            let newPage = await browser.newPage()
            let scheduleLink = await link.replace(/\.html/gm, '_games.html')

            await newPage.goto(scheduleLink)
            await newPage.waitForSelector('#content')

            let schedule = await newPage.$$eval('.filter > div > a',
            links => links.map((a)=>a.href)
            )

            
            resolve(schedule)
            await newPage.close()
        })

        //loop through seasons to get schedule urls
        let scheduleUrls = []
        for(link in seasonUrls) {
            let currentSeasonUrls = await getScheduleUrls(seasonUrls[link])
            scheduleUrls.push(currentSeasonUrls)     
        }

        console.log(scheduleUrls[0])

        //Function for schedule loop
        let getGamesUrls = (link) => new Promise(async(resolve, reject) => {
            let newPage = await browser.newPage()
            
            await newPage.goto(link)
            await newPage.waitForSelector('#schedule')

            let games = await newPage.$$eval('tr[data-row] > .center > a',
            links => links.map((a)=>a.href)
            )

            resolve(games)
            await newPage.close()
        })

       
        //loop through schedules to get box score urls
        let gamesUrls = []
        for(links in scheduleUrls) {
            if (!scheduleUrls.hasOwnProperty(links)) continue

            let objLinks = scheduleUrls[links]
                for (link in objLinks) {
                    console.log(links[link])
                    let currentScheduleUrls = await getGamesUrls(objLinks[link])
                    gamesUrls.push(currentScheduleUrls)
                }
                
                
        }
        console.log(gamesUrls[0])

        //final loop to get all games as we want
        // let scrapedGames = []
        // console.log(scrapedGames.slice[0,3])
    } 
}

module.exports = scraperObject