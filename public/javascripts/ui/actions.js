
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
        if (GameInfo.board) {
            // A board already exists
            GameInfo.board.update(result.game);
        }
        else {
            // Create a new board
            GameInfo.board = new Board(result.game.width, result.game.height, 500, 300, 0.2, result.game.tiles);
        }
        console.log(GameInfo.board);

        // Is there already a cat? If so, update the cat with the first cat
        if (GameInfo.cat) GameInfo.cat.update(result.game.player.team[0], 0, 400);
        // Else, make a new cat
        else GameInfo.cat = new Cat(result.game.player.team[0], 0, 400);
    }
}


async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.")
}

async function closeScore() {
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } else alert("Something went wrong when ending the turn.")
}