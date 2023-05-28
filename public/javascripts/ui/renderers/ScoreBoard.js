class ScoreBoard {
    static width = 75;
    static height = 50;
    static x = GameInfo.width - ScoreBoard.width - 10;
    static y = 10;
    constructor(game) {
        this.game = game;
    }
    draw() {
        scale(1);
        fill("lightgray");
        stroke(0,0,0);
        rect (ScoreBoard.x, ScoreBoard.y, ScoreBoard.width, ScoreBoard.height, 5, 5, 5, 5);
        fill(0,0,0);
        textAlign(LEFT,CENTER);
        textSize(16);
        textStyle(NORMAL);
        let turnText = "Turn: " + this.game.turn;
        let turnTextWidth = textWidth(turnText);
        text(turnText, ScoreBoard.x - (turnTextWidth * 0.5) + (ScoreBoard.width * 0.5), ScoreBoard.y + ScoreBoard.height / 2)
        if (this.game.state == "Finished"){ 
            fill(200,0,0);
            textSize(24);
            textStyle(BOLD);
            textAlign(CENTER,CENTER);
            text("GAMEOVER",ScoreBoard.x + 200, ScoreBoard.y - 5 + ScoreBoard.height / 4)    
        }
    }

    update(game) {
        this.game = game;
    }
}