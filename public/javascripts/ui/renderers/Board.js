function isEven(n) {
    return n % 2 === 0;
}

class Tile {
    static width = 150;
    static height = 130;
    static spacing = 75;

    constructor(baseTile) {
        this.x = baseTile.x;
        this.y = baseTile.y;
        this.type = baseTile.type;
    }

    draw(translateX, translateY, tileScale) {
        // Placement
        if (this.type == 3) {
            fill('rgba(186, 251, 255, 1)');
        }
        // Wall
        else if (this.type == 2) {
            fill('rgba(220, 135, 255, 1)');
        }
        // Normal
        else if (this.type == 1) {
            fill('rgba(246, 255, 253, 1)');
        }
        // If something went wrong, print black
        else {
            fill('rgba(0, 0, 0, 1)');
        }
        // Outline
        stroke(0);
        strokeWeight(5);
        push();
            translate(translateX + (Tile.width * 3 * tileScale * this.x), translateY - (Tile.height * 1 * tileScale * this.y));
            scale(tileScale);
            beginShape();
                vertex(-Tile.width * 0.5, -Tile.height);  // Top Left
                vertex(Tile.width * 0.5, -Tile.height);   // Top Right
                vertex(Tile.width, 0);                    // Middle Right
                vertex(Tile.width * 0.5, Tile.height);    // Bottom Right
                vertex(-Tile.width * 0.5, Tile.height);   // Bottom Left
                vertex(-Tile.width, 0);                   // Middle Left
            endShape(CLOSE);

            // Debug Text Inside
            fill(0, 0, 0);
            stroke(0);
            strokeWeight(1);
            textSize(72)
            text(this.x + ", " + this.y, -60, 0);
        pop();
    }

    update(tile) {
        this.x = tile.x;
        this.y = tile.y;
        this.type = tile.type;
    }
}

class Board {

    constructor(width, height, startPosX, startPosY, scale, tileArray, playerTeam, opponentTeams) {
        this.width = width;
        this.height = height;
        this.startPosX = startPosX;
        this.startPosY = startPosY
        this.scale = scale;
        this.tiles = [];
        this.player = playerTeam;       // Object
        this.opponents = opponentTeams; // Array

        // Fill the board
        for (let i = 0; i < width; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < height; j++) {
                this.tiles[i][j] = new Tile(tileArray[i][j]);
            }
        }

        // Fill placement board
        this.placementTiles = [];
        for (let k = 0; k < 6; k++) {
            let tempTile = {};
            tempTile.x = k;
            tempTile.y = 0;
            tempTile.type = 3;
            this.placementTiles[k] = new Tile(tempTile);
        }
    }

    draw() {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                if (isEven(j)) {
                    this.tiles[i][j].draw(this.startPosX, this.startPosY, this.scale);
                }
                else {
                    this.tiles[i][j].draw(this.startPosX + (Tile.width * this.scale * 1.5), this.startPosY, this.scale);
                }
            }
        }

        for (let i = 0; i < this.placementTiles.length; i++) {
            this.placementTiles[i].draw(this.startPosX + (Tile.width * this.scale * 1.5), this.startPosY + (Tile.height * this.scale * 3), this.scale);
        }
    }

    update(board) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                this.tiles[i][j].update(board[i][j]);
            }
        }
    }
}