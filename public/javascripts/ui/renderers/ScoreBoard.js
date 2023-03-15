const SB_WIDTH = 300;
const SB_HEIGHT = 100;
const SB_POSX = 10;
const SB_POSY = 10;

class ScoreBoard {
    constructor(game) {
        this.game = game;
    }
    draw() {
        fill(100,200,100);
        stroke(0,0,0);
        rect (SB_POSX,SB_POSY,SB_WIDTH,SB_HEIGHT,5,5,5,5);
        fill(0,0,0);
        textAlign(LEFT,CENTER);
        textSize(16);
        textStyle(NORMAL);
        text("Turn: "+this.game.turn,SB_POSX+10,SB_POSY+SB_HEIGHT/4)
        text("Player: "+this.game.player.name,SB_POSX+10,SB_POSY+2*SB_HEIGHT/4);
        text("Opponent: "+this.game.opponents[0].name,SB_POSX+10,SB_POSY+3*SB_HEIGHT/4);
        text(`(${this.game.player.state})`,SB_POSX+200,SB_POSY+2*SB_HEIGHT/4);
        text(`(${this.game.opponents[0].state})`,SB_POSX+200,SB_POSY+3*SB_HEIGHT/4);
        if (this.game.state == "Finished"){ 
            fill(200,0,0);
            textSize(24);
            textStyle(BOLD);
            textAlign(CENTER,CENTER);
            text("GAMEOVER",SB_POSX+200,SB_POSY-5+SB_HEIGHT/4)    
        }
    }

    update(game) {
        this.game = game;
    }
}