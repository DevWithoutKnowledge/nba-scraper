import startBrowser from './browser.mjs'
import scraperController from './pageController.mjs'

const browserInstance = startBrowser()

scraperController(browserInstance)
