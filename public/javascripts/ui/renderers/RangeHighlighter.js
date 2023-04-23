class RangeHighlighter {

    constructor(ignoreWalls, color) {
        this.sourceCat = null; // An object with x and y
        this.tiles = []; // We will store the tiles to highlight here
        this.tilesToHighlight = [];
        this.ignoreWalls = ignoreWalls;
        this.color = color
    }

    draw() {
        if (this.sourceCat) {
            let [red, green, blue] = this.color;
            stroke(red, green, blue, 150);
            // For each tile in tiles, draw them
            this.tilesToHighlight.forEach(tile => {
                push();
                    translate(World.mapDrawOffsets[this.map][0], World.mapDrawOffsets[this.map][1]);
                    fill(red, green, blue, 100);
                    strokeWeight(12);
                    stroke(red, green, blue, 150);
                    Tile.drawSimpleTile(tile.screenX, tile.screenY);
                pop();
            });
        }
    }

    getNeighborTiles() {
        // Get a list of unvisited neighbor tiles
        // For each tile in tiles
        let newNeighbors = [];
        this.tiles.forEach(tile => {
            // For each neighbor that tile has
            tile.connections.forEach(neighbor => {
                // Get the actual tile data
                let currentTile = GameInfo.world.getTileInMap(neighbor.x, neighbor.y, this.map)
                // If its not in tiles already
                // and not on our new neighbor list
                // and we are either ignore walls OR not ignoring walls but the tile we are looking at isn't a wall
                if (!this.tiles.includes(currentTile) && !newNeighbors.includes(currentTile) && (this.ignoreWalls || (!this.ignoreWalls  && currentTile.type != 2))) {
                    // Add that neighbor
                    newNeighbors.push(currentTile);
                }
            });
        });
        
        // After all this we should essentially have a new ring of neighbors saved in newNeighbors
        return newNeighbors
    }

    newSource(sourceCat, minRange, maxRange) {
        // Set our cat
        this.sourceCat = sourceCat;
        // Clear the array
        this.tiles.length = 0;
        // Lets also reset what tiles we are highlighting
        this.tilesToHighlight.length = 0;

        // Wait did we just wipe who our cat was?
        if (this.sourceCat === null) {
            // Alright, erase everything
            this.map = null;
            // And get out
            return
        }

        // Update our map
        this.map = sourceCat.map;

        // If we aren't in the placement map
        if (this.map !== 0) {
            // Add in the source tile to it
            this.tiles.push(GameInfo.world.getTileInMap(sourceCat.x, sourceCat.y, this.map));
        }

        // For the max range of our cat
        for (let i = 0; i < maxRange; i++) {
            // We want to get the neighbor tiles
            let newNeighbors = this.getNeighborTiles();
            // Add them to the total tiles list
            this.tiles = this.tiles.concat(newNeighbors);
            // And if we are at or above our minimum range, add them to the highlighted tiles as well
            if (minRange - 2 < i) {
                this.tilesToHighlight = this.tilesToHighlight.concat(newNeighbors);
            }
        }
    }
}