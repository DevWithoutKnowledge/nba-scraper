// Function for season loop
const getScheduleUrls = async (link, browser) => {
  const newPage = await browser.newPage()
  const scheduleLink = await link.replace(/\.html/gm, '_games.html')

  await newPage.goto(scheduleLink)
  await newPage.waitForSelector('#content')

  const schedule = await newPage.$$eval('.filter > div > a',
    links => links.map((a) => a.href)
  )
  await newPage.close()
  return schedule
}

export default getScheduleUrls
