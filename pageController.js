const pageSraper = require('./pageScraper')

async function scrapeAll(browserInstance){
    let browser
    try {

        browser = await browserInstance
        await pageSraper.scraper(browser)

    } catch (e) {
        console.log("Could not resolve", e)
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)