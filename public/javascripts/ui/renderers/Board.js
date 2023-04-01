function isEven(n) {
    return n % 2 === 0;
}

class Board {
    static startPosX = 100;
    static startPosY = 490;

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

        // Create main board
        for (let i = 0; i < this.width; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.tiles[i][j] = new Tile(tileArray[i][j]);
            }
        }

        // Create placement board
        this.placementTiles = [];
        for (let k = 0; k < 6; k++) {
            let tempTile = {};
            tempTile.x = k;
            tempTile.y = 0;
            tempTile.type = 3;
            this.placementTiles[k] = new Tile(tempTile);
        }
        
        this.player = new Team(playerTeam.team.id, playerTeam.team.cats, [151, 255, 175]); // Object
        this.opponents = opponentTeams; // Array
        this.unplacedCats = this.#unplacedCatsCheck();
    }

    draw() {

        // Main Board
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].draw(0, 0, this.scale);
            }
        }

        if (this.unplacedCats) {
            // Show Placement Tile
            for (let i = 0; i < this.placementTiles.length; i++) {
                this.placementTiles[i].draw(Tile.width * -this.scale * 1.5, Tile.height * 3 * this.scale, this.scale);
            }

            // Show cats in placement tile
            this.player.draw(Tile.width * -this.scale * 1.5, Tile.height * 3 * this.scale, this.scale)
        }
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
}