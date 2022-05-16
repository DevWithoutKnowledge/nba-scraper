let boxscoreScraper = (gamePage, gameInfo) => new Promise(async(resolve, reject) => {
    // let gamePage = await browser.newPage()
    // await gamePage.goto(link)
    const teamTableId = 'box-' + gameInfo + '-game-advanced'

        const advBoxscore = await gamePage.evaluate((tId) => {
        let data = [];
        let table = document.getElementById(tId);
  
        for (var i = 1; i < table.rows.length; i++) {
          let objCells = table.rows.item(i).cells;
          let values= []

          for (var j = 0; j < objCells.length; j++) {
            let text = objCells.item(j).innerHTML;
            if(text.length > 0) values.push(text)
            else values.push(null);
          }
          data.push(values);
        }
        
        return data;
      }, teamTableId);
      //console.log(boxscore)
    resolve(advBoxscore)
})

export default boxscoreScraper