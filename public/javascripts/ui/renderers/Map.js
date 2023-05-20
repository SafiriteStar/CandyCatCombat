class Map {
    constructor (width, height, tiles, drawStartX, drawStartY) {
        this.width = width;
        this.height = height;
        this.drawStartX = drawStartX;
        this.drawStartY = drawStartY;
        
        this.tiles =[];

        // 2D tile array
        for (let i = 0; i < this.width; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.height; j++) {
                if (tiles[i][j] !== null) {
                    this.tiles[i][j] = new Tile(tiles[i][j]);
                }
            }
        }
    }

    getTile(x, y) {
        return this.tiles[x][y];
    }

    getTileNeighbors(x, y) {
        return this.tiles[x][y].connections;
    }

    // Checks if X, Y tile exists within the map
    checkTileExists(x, y) {
        if (this.tiles[x] !== null && this.tiles[x] !== undefined) {
            if (this.tiles[x][y] !== null && this.tiles[x][y] !== undefined) {
                return true;
            }
        }

        return false;
    }

    // Checks if the given X and Y position have a tile
    checkPositionExists(screenX, screenY) {
        let tileCoordX = Math.floor((screenX) / (Tile.width * 1.5)) - (this.drawStartX / (Tile.width * 1.5));
        let tileCoordY = Math.ceil((-screenY - Tile.height) / (Tile.height * 2)) + (this.drawStartY / (Tile.height * 2));
        
        return this.checkTileExists(tileCoordX, tileCoordY);
    }

    getPositionCoord(screenX, screenY) {
        let tileCoordX = Math.floor((screenX) / (Tile.width * 1.5)) - (this.drawStartX / (Tile.width * 1.5));
        let tileCoordY = Math.ceil((-screenY - Tile.height) / (Tile.height * 2)) + (this.drawStartY / (Tile.height * 2));

        return [tileCoordX, tileCoordY]
    }

    draw() {
        push();
        translate(this.drawStartX, this.drawStartY);

        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].draw()
            }
        }
        pop();
    }

    update(tiles) {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].update(tiles[i][j]);
            }
        }
    }
}