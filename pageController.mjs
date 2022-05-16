import pageScraper  from './pageScraper.mjs'

async function scrapeAll(browserInstance){
    let browser
    try {

        browser = await browserInstance
        await pageScraper(browser)

    } catch (e) {
        console.log("Could not resolve", e)
    }
}

export default (browserInstance) => scrapeAll(browserInstance)