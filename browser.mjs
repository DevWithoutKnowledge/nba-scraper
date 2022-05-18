import Puppeteer from 'puppeteer'

async function startBrowser () {
  let browser
  try {
    console.log('Opening...')
    browser = await Puppeteer.launch(
      {
        headless: true,
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true
      }
    )
  } catch (e) {
    console.log('Could not create', e)
  }
  return browser
}

export default startBrowser
