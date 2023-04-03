function isEven(n) {
    return n % 2 === 0;
}

function roundToNumber(n, base) {
    return Math.round(n/base) * base;
}

class Board {
    static startPosX = 0;
    static startPosY = 0;
    static placementBoardXOffset = Tile.width * 1.5;
    static placementBoardYOffset = Tile.height * 3;


    // Check for unplaced cats
    #unplacedCatsCheck() {
        let catsUnplaced = false;
        for (let i = 0; i < this.player.cats.length; i++) {
            // If its null
            if (this.player.cats[i].x == null || this.player.cats[i].y == null) {
                catsUnplaced = true;
                // Set the cat to the placement tile
                this.player.cats[i].placementX = i;
                this.player.cats[i].placementY = 0;
            }
            else {
                this.player.cats[i].placementX = null;
                this.player.cats[i].placementY = null;
            }
        }
        return catsUnplaced;
    }

    constructor(width, height, tileArray, playerTeam, opponentTeams) {
        this.width = width;
        this.height = height;
        this.scale = 0.2
        this.tiles = [];
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraMouseStartX = 0;
        this.cameraMouseStartY = 0;

        // Create main board
        for (let i = 0; i < this.width; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.height; j++) {
                if (!(tileArray[i][j] === null)) {
                    this.tiles[i][j] = new Tile(tileArray[i][j], 0, 0);
                }
            }
        }

        // Create placement board
        this.placementTiles = [];
        for (let k = 0; k < 6; k++) {
            let tempTile = {};
            tempTile.x = k;
            tempTile.y = 0;
            tempTile.type = 3;
            this.placementTiles[k] = new Tile(tempTile, Board.placementBoardXOffset, Board.placementBoardYOffset);
        }
        
        this.player = new Team(playerTeam.team.id, playerTeam.team.cats, [151, 255, 175]); // Object
        this.opponents = opponentTeams; // Array
        this.unplacedCats = this.#unplacedCatsCheck();
    }

    draw() {
        
        if (mouseIsPressed === true) {
            let mouseXDelta = this.cameraMouseStartX - mouseX;
            let mouseYDelta = this.cameraMouseStartY - mouseY;
            
            this.cameraX = this.cameraX - (mouseXDelta * 3);
            this.cameraY = this.cameraY - (mouseYDelta * 3);
            
            this.cameraMouseStartX = mouseX;
            this.cameraMouseStartY = mouseY;
        }

        push();
            scale(this.scale);
            // Camera Translation
            translate(this.cameraX, this.cameraY);
            // Legacy Translation for debugging
            translate(Board.startPosX / this.scale, Board.startPosY / this.scale);
            
            // Main Board
            for (let i = 0; i < this.tiles.length; i++) {
                for (let j = 0; j < this.tiles[i].length; j++) {
                    this.tiles[i][j].draw();
                }
            }

            if (this.unplacedCats) {
                // Show Placement Tile
                for (let i = 0; i < this.placementTiles.length; i++) {
                    this.placementTiles[i].draw();
                }

                // Show cats in placement tile
            }

            // Draw player cats
            this.player.draw()

            // TODO:
            // If there are no unplaced cats
            // Draw the opponent cats as well

            
            // Get where the mouse is
            let mouseTileScreenX = (roundToNumber((mouseX - (this.cameraX * this.scale)) / this.scale, 225));
            let mouseTileScreenY = (roundToNumber((mouseY - (this.cameraY * this.scale)) / this.scale, 130));

            // Debug circle so we know where we are
            circle(
                mouseTileScreenX,
                mouseTileScreenY,
                100
            )

            // Get the Y of where we are
            let mouseTilePosY = ((mouseTileScreenY / 130) * -1);
            let mouseTilePosX = 0

            if (isEven(mouseTilePosY)) {
                mouseTilePosX = Math.floor((mouseTileScreenX / 450) + 0.5);
            }
            else {
                mouseTilePosX = Math.floor((mouseTileScreenX / 450) + 0.5);
            }

            console.log("X: " + mouseTilePosX);
            console.log("Y: " + mouseTilePosY);

        pop();
    }

    update(board) {
        // Update the tiles
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                this.tiles[i][j].update(board[i][j]);
            }
        }

        // Update cat info
        console.log(board);
        this.player = new Team (board.player.team.id, board.player.team.cats, [151, 255, 175]);
        this.opponents = board.opponents;
        this.unplacedCats = this.#unplacedCatsCheck();
    }

    changeScale(event) {
        if (event.deltaY > 0 && this.scale > 0.11) {
            this.scale = this.scale - 0.01;
            
            if (this.scale < 0.11) {
                this.scale = 0.11;
            }
        }
        else if (event.deltaY < 0 && this.scale < 0.34) {
            this.scale = this.scale + 0.01;
            
            if (this.scale > 0.34) {
                this.scale = 0.34;
            }
        }
    }

    mousePressed() {
        this.cameraMouseStartX = mouseX;
        this.cameraMouseStartY = mouseY;
    }

    changeSelectedTile(tile) {
        this.selectionTile = tile;
    }
}