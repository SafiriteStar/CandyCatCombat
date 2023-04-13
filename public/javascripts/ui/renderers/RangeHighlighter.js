class RangeHighlighter {
    static color = [164, 149, 255];

    constructor() {
        this.sourceCat = null; // An object with x and y
        this.tiles = []; // We will store the tiles to highlight here
    }

    draw() {
        if (this.sourceCat) {
            push();
                stroke(255, 255, 0, 150);
                // For each tile in tiles, draw them
                this.tiles.forEach(tile => {
                    Tile.drawSimpleTile(tile.x, tile.y);
                });
            pop();
        }
    }

    getNeighborTiles() {
        // Get a list of unvisited neighbor tiles
        // For each tile in tiles
        let newNeighbors = []
        this.tiles.forEach(tile => {
            // For each neighbor that tile has
            tile.connections.forEach(neighbor => {
                // Get the actual tile data
                let currentTile = GameInfo.world.getTileInMap(neighbor.x, neighbor.y, this.map)
                // If its not in tiles already (or our new neighbor list)
                if (!this.tiles.includes(currentTile) && !newNeighbors.includes(currentTile)) {
                    // Add that neighbor
                    newNeighbors.push(currentTile)
                }
            });

            // After getting all the new neighbors
            // Add them to the original tiles list
        });
        
        // For each new neighbor we have
        newNeighbors.forEach(newTile => {
            // Add them to the list
            this.tiles.push(newTile);
        });
    }

    newSource(sourceCat) {
        this.sourceCat = sourceCat;

        // Update our map
        this.map = sourceCat.map;
        // Clear the array
        this.tiles.length = 0;

        // Add in the source tile to it
        this.tiles.push(GameInfo.world.getTileInMap(sourceCat.x, sourceCat.y, this.map));
    }
}