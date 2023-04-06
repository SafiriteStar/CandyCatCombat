
async function getGameInfo() {
    let result = await requestPlayerGame();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) GameInfo.scoreBoard.update(GameInfo.game); 
        else GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
        // if game ended we get the scores and prepare the ScoreWindow
        if (GameInfo.game.state == "Finished") {
            let result = await requestScore();
            GameInfo.scoreWindow = new ScoreWindow(50,50,GameInfo.width-100,GameInfo.height-100,result.score,closeScore);
        }
    }
}

async function getBoardInfo() {
    // Ask the server for game and board information
    let result = await requestGameBoard();

    // Did we get it?
    if (!result.successful) {
        // Nope, try and login again
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        // Yup the server sent us something back
        console.log(result.game);

        // Actual board
        if (GameInfo.board) {
            // A board already exists
            GameInfo.board.update(result.game);
        }
        else {
            // Create a new board
            GameInfo.board = new Board(result.game.width, result.game.height, result.game.tiles, result.game.player, result.game.opponents);
        }
    }
}

async function moveCatAction(x, y, placementX, placementY, catID) {
    let result = await requestMoveCharacter(x, y, placementX, placementY, catID)

    if (result.successful) {
        await getGameInfo();
        await getBoardInfo();
        GameInfo.prepareUI();
    }
    else {
        alert("Something went wrong when trying to move the character");
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

async function closeScore() {
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } else alert("Something went wrong when ending the turn.")
}