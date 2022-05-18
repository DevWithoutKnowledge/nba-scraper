// Function for schedule loop
const getGamesUrls = async (link, browser) => {
  const newPage = await browser.newPage()

  await newPage.goto(link)
  await newPage.waitForSelector('#schedule')

  const games = await newPage.$$eval('tr[data-row] > .center > a',
    links => links.map((a) => a.href)
  )
  await newPage.close()
  return games
}

export default getGamesUrls
