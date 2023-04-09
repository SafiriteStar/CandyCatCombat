const Game = require("../../../models/gamesModel");

async function refresh() {
    if (GameInfo.game.player.state == "Waiting") { 
        // Every time we are waiting
        await getGameInfo();
        await getBoardInfo();

        if (GameInfo.game.player.state != "Waiting") {
            // The moment we pass from waiting to play
            GameInfo.prepareUI();
        }
    } 
    // Nothing to do when we are playing since we control all that happens 
    // so no update is needed from the server
}

function preload() {

}


async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');
    canvas.mouseWheel(changeScale); // Attach listener for when the mouse wheel is over the canvas 
    // preload  images
    
    await getGameInfo();
    await getBoardInfo();
    setInterval(refresh,1000);

    //buttons (create a separated function if they are many)
    GameInfo.endturnButton = createButton('End Turn');
    GameInfo.endturnButton.parent('game');
    GameInfo.endturnButton.position(GameInfo.width-150,GameInfo.height-50);
    GameInfo.endturnButton.mousePressed(endturnAction);
    GameInfo.endturnButton.addClass('game')


    GameInfo.prepareUI();
    

    GameInfo.loading = false;

    // Prevent right click context menu from appearing when hovering over p5
    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
}

function draw() {
    background(220);
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width/2, GameInfo.height/2);
    } else if (GameInfo.game.state == "Finished" && GameInfo.scoreWindow) {
        GameInfo.scoreWindow.draw();
    } else  {
        GameInfo.world.draw();
        GameInfo.scoreBoard.draw();
    }
}

async function mousePressed() {
    GameInfo.world.mousePressed();
}

async function mouseReleased() {
    GameInfo.world.mouseReleased();
}

async function mouseClicked() {
  
}

function changeScale(event) {
    GameInfo.world.changeScale(event);
}