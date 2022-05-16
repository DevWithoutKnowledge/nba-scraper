 //Function for season loop
 let getScheduleUrls = (link, browser) => new Promise(async(resolve, reject) => {
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
export default getScheduleUrls