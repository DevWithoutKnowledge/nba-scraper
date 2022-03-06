const puppeteer = require('puppeteer')

async function startBrowser(){
    let browser
    try {
      console.log("Opening...")
      browser = await puppeteer.launch(
        {
          headless: false,
          args: ["--disable-setuid-sandbox"],
          'ignoreHTTPSErrors': true
        }
      )
    } catch (e) {
      console.log("Could not create" , e)
    }
    return browser
}
module.exports = {
  startBrowser
}