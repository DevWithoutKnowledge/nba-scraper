import startBrowser  from './browser.mjs';
import scraperController from './pageController.mjs';

let browserInstance = startBrowser()

scraperController(browserInstance)