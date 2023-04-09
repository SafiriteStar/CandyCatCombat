function isEven(n) {
    return n % 2 === 0;
}

function roundToNumber(n, base) {
    return Math.round(n/base) * base;
}

class Board {
    static startPosX = 0;
    static startPosY = 0;
    static placementBoardXOffset = Tile.width * 0;
    static placementBoardYOffset = Tile.height * 4;

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

        // Camera
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraMouseStartX = 0;
        this.cameraMouseStartY = 0;

        // Hover Tile
        this.mouseHoverTilePosX = 0;
        this.mouseHoverTilePosY = 0;
        this.mouseHoverTileCoordX = 0;
        this.mouseHoverTileCoordY = 0;

        // Selection Tile
        this.selectedHexPosX = null;
        this.selectedHexPosY = null;
        this.selectedHexCoordX = null;
        this.selectedHexCoordY = null;

        // Selected Cat
        this.selectedCat = null;

        // Tile Info UI
        this.tileInfo = new TileInfo();

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

    #checkTileExists(x, y) {
        if (this.tiles[x] !== null && this.tiles[x] !== undefined) {
            if (this.tiles[x][y] !== null && this.tiles[x][y] !== undefined) {
                return true;
            }
        }
        return false;
    }

    #checkPlacementTileExists(x, y) {
        if (this.placementTiles[x] !== null && this.placementTiles[x] !== undefined) {
            return true;
        }
        return false;
    }

    draw() {
        
        if (mouseIsPressed === true) {
            let mouseXDelta = this.cameraMouseStartX - mouseX;
            let mouseYDelta = this.cameraMouseStartY - mouseY;
            
            this.cameraX = this.cameraX - (mouseXDelta / this.scale);
            this.cameraY = this.cameraY - (mouseYDelta / this.scale);
            
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
            
            // Get where the mouse is
            let mouseScreenX = ((mouseX - (this.cameraX * this.scale)) / this.scale);
            let mouseScreenY = (mouseY - (this.cameraY * this.scale)) / this.scale;
            this.mouseHoverTilePosX = (roundToNumber(mouseScreenX, Tile.width * 1.5));
            this.mouseHoverTilePosY = (roundToNumber(mouseScreenY, Tile.height));
            
            
            // If its odd then 
            if (!(isEven(this.mouseHoverTilePosX))) {
                this.mouseHoverTilePosY = (roundToNumber(mouseScreenY, Tile.height * 2));
            }
            else {
                this.mouseHoverTilePosY = (roundToNumber(mouseScreenY + Tile.height, Tile.height * 2)) - Tile.height;
            }
            
            // Get the tile coordinates
            // Adjustments are made here to translate to the correct coordinates
            this.mouseHoverTileCoordY = Math.ceil((-this.mouseHoverTilePosY - Tile.height) / (Tile.height * 2));
            this.mouseHoverTileCoordX = Math.floor((this.mouseHoverTilePosX) / (Tile.width * 1.5));

            // Hover Hex
            push();
                stroke(255, 255, 255, 150);
                Tile.drawSimpleTile(this.mouseHoverTilePosX, this.mouseHoverTilePosY);
            pop();
            if (this.#checkTileExists(this.selectedHexCoordX, this.selectedHexCoordY)) {
                // Selection Hex
                push();
                    stroke(255, 255, 0, 150);
                    Tile.drawSimpleTile(this.selectedHexPosX, this.selectedHexPosY);
                pop();
            }
            else if (this.#checkPlacementTileExists(this.selectedHexCoordX, this.selectedHexCoordY)) {
                // Selection Hex at placement board
                push();
                    stroke(255, 255, 0, 150);
                    translate(Board.placementBoardXOffset, Board.placementBoardYOffset);
                    Tile.drawSimpleTile(this.selectedHexPosX, this.selectedHexPosY);
                pop();
            }
        pop();

        this.tileInfo.draw();
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

    #getPlayerCatAtCoord(x, y) {
        for (let i = 0; i < this.player.cats.length; i++) {
            if (this.player.cats[i].x === x && this.player.cats[i].y === y) {
                return i;
            }          
        }

        return null;
    }

    #getPlayerCatAtPlacementCoord(x, y) {
        for (let i = 0; i < this.player.cats.length; i++) {
            if (this.player.cats[i].placementX === x && this.player.cats[i].placementY === y) {
                return i;
            }          
        }

        return null;
    }

    mouseReleased() {
        // Check if the tile we clicked on exists
        if (this.#checkTileExists(this.mouseHoverTileCoordX, this.mouseHoverTileCoordY)) {
            // Do we have a cat
            if (this.selectedCat !== null) {
                // Yes we do
                // Is there a player cat at our target location
                let targetCoordCat = this.#getPlayerCatAtCoord(this.mouseHoverTileCoordX, this.mouseHoverTileCoordY);
                if (targetCoordCat !== null) {
                    // There is a cat at the target
                    // Is the target cat the same as ours?
                    if (this.selectedCat == targetCoordCat) {
                        // It is
                        // Unselect our current cat
                        this.selectedCat = null;
                    }
                    else {
                        // Different cat
                        // Switch which one we are focusing on
                        this.selectedCat = targetCoordCat;
                    }
                }
            }
            else {
                // We had no cat
                // Try to get a new one
                this.selectedCat = this.#getPlayerCatAtCoord(this.mouseHoverTileCoordX, this.mouseHoverTileCoordY);
            }
            this.selectedHexCoordX = this.mouseHoverTileCoordX;
            this.selectedHexCoordY = this.mouseHoverTileCoordY;
            this.selectedHexPosX = this.mouseHoverTilePosX;
            this.selectedHexPosY = this.mouseHoverTilePosY;

            console.log("Selected Cat: " + this.selectedCat);
            console.log("Tile:");
            console.log(this.tiles[this.selectedHexCoordX][this.selectedHexCoordY]);

            this.tileInfo.update(this.tiles[this.selectedHexCoordX][this.selectedHexCoordY], this.selectedCat);
        }
        else {
            // If it doesn't exist, we should check if its in the placement board
            let placementCoordY = Math.ceil((-this.mouseHoverTilePosY - Tile.height + Board.placementBoardYOffset) / (Tile.height * 2));
            let placementCoordX = Math.floor((this.mouseHoverTilePosX + Board.placementBoardXOffset) / (Tile.width * 1.5));
            if (this.#checkPlacementTileExists(placementCoordX, placementCoordY)) {
                // Do we have a cat
                if (this.selectedCat !== null) {
                    // Yes we do
                    // Is there a player cat at our target location
                    let targetCoordCat = this.#checkPlacementTileExists(placementCoordX, placementCoordY);
                    if (targetCoordCat !== null) {
                        // There is a cat at the target
                        // Is the target cat the same as ours?
                        if (this.selectedCat == targetCoordCat) {
                            // It is
                            // Unselect our current cat
                            this.selectedCat = null;
                        }
                        else {
                            // Different cat
                            // Switch which one we are focusing on
                            this.selectedCat = targetCoordCat;
                        }
                    }
                }
                else {
                    // We had no cat
                    // Try to get a new one
                    this.selectedCat = this.#getPlayerCatAtPlacementCoord(placementCoordX, placementCoordY);
                }

                this.selectedHexCoordX = placementCoordY;
                this.selectedHexCoordY = placementCoordX;

                this.selectedHexPosX = this.mouseHoverTilePosX;
                this.selectedHexPosY = this.mouseHoverTilePosY;

                this.tileInfo.update(this.placementTiles[this.selectedHexCoordX], this.selectedCat);
            }
        }

        // Check if we have a cat
        if (this.tileInfo.cat !== null) {
            // Check if we clicked on a tile in the board
            // And that it is not the same tile the cat is on

            if (this.#checkTileExists(this.selectedHexCoordX, this.selectedHexCoordY) && (this.player.cats[this.tileInfo.cat].x != this.selectedHexCoordX || this.player.cats[this.tileInfo.cat].y != this.selectedHexCoordY)) {
                moveCatAction(this.selectedHexCoordX, this.selectedHexCoordY, null, null, this.player.cats[this.tileInfo.cat].id);
            }
        }

    }
}