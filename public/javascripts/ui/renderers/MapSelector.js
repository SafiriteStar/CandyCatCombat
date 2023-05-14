class MapSelector {
    constructor() {
        // Tile
        this.posX = null;
        this.posY = null;
        this.coordX = null;
        this.coordY = null;

        // Map
        this.map = null;

        // Cat
        this.team = null;
        this.cat = null; // An index for the team

        // Tile Info Box
        this.tileInfoBox = new TileInfoBox();
    
        // Cat Info Box
        this.catInfoBox = new CatInfoBox();

        // Range indicator
        this.rangeIndicator = new RangeHighlighter(true, true, [230, 30, 30]);
        this.moveIndicator = new RangeHighlighter(false, false, [164, 149, 255]);

        //
        this.path = null;
    }
    
    draw() {
        push();
            fill(0, 0, 0, 0);
            strokeWeight(24);
            stroke(255, 255, 0, 150);
            Tile.drawSimpleTile(this.posX, this.posY);
        pop();
        this.drawIndicators();
    }
    
    drawIndicators() {
        this.rangeIndicator.draw();
        if (this.team !== null && this.team !== undefined) {
            if (!GameInfo.world.teams[this.team].cats[this.cat].isRooted()) {
                this.moveIndicator.draw();
            }
        }
    }

    drawInfoBoxes() {
        if (this.map !== null) {
            this.tileInfoBox.draw();
        }

        if (this.cat !== null) {
            this.catInfoBox.draw();
        }
    }

    #getCatAtTile(coordX, coordY, map) {
        let team = null;
        let cat  = null;
        // For every team
        for (let i = 0; i < GameInfo.world.teams.length; i++) {
            // Try and get a cat
            cat = GameInfo.world.teams[i].getCatAtCoord(coordX, coordY, map);
            if (cat !== null && cat !== undefined && ((map < 1 && i === 0) || map > 0)) {
                team = i;
                // We have a cat and a team, return them
                return [team, cat]
            }
            else {
                let team = null;
            }
        }
        return [team, cat]
    }

    updateRangeIndicators(selectedCatData) {
        if (selectedCatData === null) {
            this.rangeIndicator.newSource(null, null, null);
            this.moveIndicator.newSource(null, null, null);
        }
        else {
            this.rangeIndicator.newSource(selectedCatData, selectedCatData.min_range, selectedCatData.max_range);
            this.moveIndicator.newSource(selectedCatData, 1, selectedCatData.stamina);
        }
    }
    
    update(posX, posY, coordX, coordY, map) {
        this.posX = posX;
        this.posY = posY;
        this.coordX = coordX;
        this.coordY = coordY;
        this.map = map;
        // If we are on a map
        if (this.coordX !== null && this.coordY != null && this.map != null) {
            
            this.tileInfoBox.update(GameInfo.world.maps[this.map].getTile(this.coordX, this.coordY), this.map);

            // Try and see who is in the tile
            let [newTeam, newCat] = this.#getCatAtTile(this.coordX, this.coordY, this.map);

            // If there is a cat in the new tile
            if (newTeam !== null && newCat !== null) {
                // Wait is the cat alive?
                if (GameInfo.world.teams[newTeam].cats[newCat].current_health > 0) {
                    // It is!
                    // Set the current cat to the new one
                    this.team = newTeam;
                    this.cat = newCat;
                    // Update our indicators
                    this.catInfoBox.update(this.cat, this.team);
                    this.updateRangeIndicators(GameInfo.world.teams[this.team].cats[this.cat]);
                }
            }
            else {
                // There was no cat in that tile
                // Do we have *a* cat already and was that tile not a caramel tile?
                if (this.team !== null && this.team !== undefined) {
                    // We do
                    // Do we have a player cat?
                    if (this.team == 0 && !GameInfo.world.teams[this.team].cats[this.cat].isRooted() && GameInfo.world.checkOtherTeamsCaramelTile(this.team, this.coordX, this.coordY, this.map + 1) === false) {
                        // We do
                        // Lets try to move to the tile we just clicked
                        let startingTile = GameInfo.world.getTileInMap(
                            GameInfo.world.teams[this.team].cats[this.cat].x,
                            GameInfo.world.teams[this.team].cats[this.cat].y,
                            GameInfo.world.teams[this.team].cats[this.cat].map)
                        let targetTile = GameInfo.world.getTileInMap(this.coordX, this.coordY, this.map);
                        if (GameInfo.game.player.state == "Placement") {
                            this.path = [targetTile];
                        }
                        else {
                            this.path = Pathfinder.getPath(startingTile, targetTile, this.moveIndicator.tilesToHighlight);
                        }

                        if (this.path.length > 0
                            && ((this.moveIndicator.tilesToHighlight.includes(targetTile) && GameInfo.game.player.state == "Playing")
                            || GameInfo.game.player.state == "Placement")) {
                            moveCatAction(this.path, GameInfo.world.teams[this.team].cats[this.cat].id);
                        }
                    }
                    else {
                        // No
                        // Lets set it to null
                        this.cat = null;
                        this.team = null;
                        this.updateRangeIndicators(null);
                    }
                }
                else {
                    // No
                    // Lets set it to null
                    this.cat = null;
                    this.team = null;
                    this.updateRangeIndicators(null);
                }
            }
        }
        else {
            // We are not on a map, clear cat info
            this.cat = null;
            this.team = null;
            this.updateRangeIndicators(null);
        }
    }
}