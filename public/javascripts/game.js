window.onload = async function() {
    try {
        let result = await checkGame(true);
        if (result.err) throw result.err;
        
        // Get default team
        result = await requestDefaultTeam();

        window.baseCats = result.baseCats;
        document.getElementById('game').appendChild(createCatInfoSideBar(result.baseCats));
        calculateStatRanges(result.baseCats);

        let catInfoSideBars = document.getElementsByClassName('catInfoContainer');
        for (let i = 0; i < catInfoSideBars.length; i++) {
            createMouseOverFunctions(catInfoSideBars[i]);
        }

        createScoreScreen();

        let pauseMenus = document.getElementsByClassName('pauseMenuFrame');
        for (let i = 0; i < pauseMenus.length; i++) {
            createMouseOverFunctions(pauseMenus[i]);
        }
    } catch (err) {
        console.log(err);
    }
}

