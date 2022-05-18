const gameScraper = async (gamePage, link, seasonId) => {
  const dataObj = {}

  // let gamePage = await browser.newPage()
  // await gamePage.goto(link)

  dataObj.season_id = seasonId
  dataObj.game_name = link.slice(-17, -5)
  dataObj.game_date = await gamePage.$eval('.scorebox_meta > div:first-child', text => text.textContent)
  dataObj.game_date = new Date(dataObj.game_date)

  const teams = await gamePage.$$eval('.scorebox > div > div > strong > a', links => links.map((a) => a.href))
  dataObj.away = teams[0].slice(-13, -10)
  dataObj.home = teams[1].slice(-13, -10)

  const points = await gamePage.$$eval('.scores > div.score', score => score.map((div) => div.textContent))
  dataObj.is_home_win = parseInt(points[0]) < parseInt(points[1])

  return dataObj
}

export default gameScraper
