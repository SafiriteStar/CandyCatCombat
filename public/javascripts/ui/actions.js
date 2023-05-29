
async function getGameInfo() {
    let result = await requestPlayerGame();

    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.game.state == "Canceled") {
            window.location.reload()
        }
        if (GameInfo.scoreBoard) {
            GameInfo.scoreBoard.update(GameInfo.game);  
        }
        else {
            GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
        }
        // if game ended we get the scores and prepare the ScoreWindow
        if (GameInfo.game.state == "Finished") {
            let result = await requestScore();
            await getBoardInfo();
            formatPlayerScores(result.score.playerScores, GameInfo.game.player, GameInfo.game.opponents, GameInfo.world.teams);
        }
    }
}

async function getBoardInfo() {
    // Ask the server for game and board information
    let resultTeams = await requestGameTeams();
    
    // Did we get it?
    if (!resultTeams.successful) {
        // Nope, try and login again
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        // Yup the server sent us something back
        
        // Does the world exist?
        if (GameInfo.world) {
            // A board already exists
            GameInfo.world.update(resultTeams.teams.player, resultTeams.teams.opponents);
        }
        else {
            // Get the map data
            let resultMap = await requestMap();
            if (!resultMap.successful) {
                // Oops
                alert("Something is wrong with the game please login again!");
                window.location.pathname = "index.html";
            }
            else {
                // Create a new board
                GameInfo.world = new World(resultMap.map.maps, resultTeams.teams.player, resultTeams.teams.opponents);
                GameInfo.world.updateTeamCatFaces();
            }
        }
    }
}

async function endturnAction() {
    GameInfo.endturnButton.hide();
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        await getBoardInfo();
        GameInfo.prepareUI();
        GameInfo.world.playerAttack();
    }
    else {
        console.log(result);
        alert("Something went wrong when ending the turn.");
        GameInfo.endturnButton.show();
    }
}

async function placementReadyAction() {
    GameInfo.placementReadyButton.hide();
    let result = await requestPlacementReady();
    if (result.successful) {
        await  getGameInfo();
        await getBoardInfo();
        GameInfo.prepareUI();
    }
    else {
        console.log(result);
        alert("Something went wrong when readying up.");
        GameInfo.placementReadyButton.show();
    }
}

async function moveCatAction(path, catID) {
    let result = await requestMoveCharacter(path, catID)

    if (result.successful) {
        await getGameInfo();
        await getBoardInfo();
    }
    else {
        console.log(result);
        alert("Something went wrong when trying to move the character\n" + result.msg);
    }
}

async function closeScore() {
    playClick();
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } 
    else {        
        console.log(result);
        alert("Something went wrong when ending the turn.")
    }
}