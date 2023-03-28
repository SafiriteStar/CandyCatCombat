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
        fill('rgba(255, 255, 100, .25)');
        stroke(255);
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
    constructor(width, height, startPosX, startPosY, scale, tileArray) {
        this.width = width;
        this.height = height;
        this.startPosX = startPosX;
        this.startPosY = startPosY
        this.scale = scale;
        this.tiles = [];

        for (let i = 0; i < width; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < height; j++) {
                this.tiles[i][j] = new Tile(tileArray[i][j]);
            }
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
    }

    update(board) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                this.tiles[i][j].update(board[i][j]);
            }
        }
    }
}