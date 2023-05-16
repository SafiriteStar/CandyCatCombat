window.onload = async function() {
    try {
        let result = await checkGame(true);
        if (result.err) throw result.err;
        
        // Get default team
        result = await requestDefaultTeam();
        if (!result.successful || result.err) { throw result.err || { err: "Not successful" } }
        createBooklet(result.baseCats);
        createScoreScreen();

        let pauseMenus = document.getElementsByClassName('pauseMenuFrame');
        for (let i = 0; i < pauseMenus.length; i++) {
            createMouseOverFunctions(pauseMenus[i]);
        }
    } catch (err) {
        console.log(err);
    }
}

