//Function for schedule loop
let getGamesUrls = (link, browser) => new Promise(async(resolve, reject) => {
    let newPage = await browser.newPage()
    
    await newPage.goto(link)
    await newPage.waitForSelector('#schedule')

    let games = await newPage.$$eval('tr[data-row] > .center > a',
    links => links.map((a)=>a.href)
    )

    resolve(games)
    await newPage.close()
})
export default getGamesUrls