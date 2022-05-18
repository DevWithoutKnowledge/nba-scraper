const boxscoreScraper = async (gamePage, gameInfo) => {
  // let gamePage = await browser.newPage()
  // await gamePage.goto(link)
  const teamTableId = 'box-' + gameInfo + '-game-advanced'

  const advBoxscore = await gamePage.evaluate((tId) => {
    const data = []
    const table = document.getElementById(tId)

    for (let i = 1; i < table.rows.length; i++) {
      const objCells = table.rows.item(i).cells
      const values = []

      for (let j = 0; j < objCells.length; j++) {
        const text = objCells.item(j).innerHTML
        if (text.length > 0) values.push(text)
        else values.push(null)
      }
      data.push(values)
    }
    return data
  }, teamTableId)
  return advBoxscore
}

export default boxscoreScraper
