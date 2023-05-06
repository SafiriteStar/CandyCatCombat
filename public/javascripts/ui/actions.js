
async function getGameInfo() {
    let result = await requestPlayerGame();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) {
            GameInfo.scoreBoard.update(GameInfo.game);  
        }
        else {
            GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
        }
        // if game ended we get the scores and prepare the ScoreWindow
        if (GameInfo.game.state == "Finished") {
            let result = await requestScore();
            GameInfo.scoreWindow = new ScoreWindow(50, 50, GameInfo.width-100, GameInfo.height-100, result.score, closeScore);
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
        console.log(resultTeams.teams);
        
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
                console.log(resultMap.map);
                GameInfo.world = new World(resultMap.map.maps, resultTeams.teams.player, resultTeams.teams.opponents);
            }
        }

        console.log(GameInfo.world);
    }
}

async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        await getBoardInfo();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.");
}

async function placementReadyAction() {
    let result = await requestPlacementReady();
    if (result.successful) {
        await  getGameInfo();
        await getBoardInfo();
        GameInfo.prepareUI();
    } else alert("Something went wrong when readying up.");
}

async function moveCatAction(path, catID, teamID) {
    let result = await requestMoveCharacter(path, catID, teamID)

    if (result.successful) {
        await getGameInfo();
        await getBoardInfo();
        GameInfo.prepareUI();
    }
    else {
        alert("Something went wrong when trying to move the character");
    }
}

async function closeScore() {
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } else alert("Something went wrong when ending the turn.")
}