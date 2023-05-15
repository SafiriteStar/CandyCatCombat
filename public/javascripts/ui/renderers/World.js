class World {
    static cameraStartPosX = Tile.width * 1.5 * 5;
    static cameraStartPosY = Tile.height * 7.5 * 5;

    static teamColors = [
        [151, 255, 175],
        [255, 151, 175]
    ];

    static mapDrawOffsets = [
        [-Tile.width * 3, -Tile.height * 14],
        [0, 0]
    ]

    constructor(maps, player, opponents, playerOrder) {
        // -- Camera & Mouse --
        this.scale = 0.2;
        
        this.cameraX = World.cameraStartPosX;
        this.cameraY = World.cameraStartPosY;
        this.cameraMouseStartX = 0;
        this.cameraMouseStartY = 0;

        this.canDrag = true;

        // Mouse World Position
        this.mouseScreenX = 0;
        this.mouseScreenY = 0;
        this.mouseXDragDelta = 0;
        this.mouseYDragDelta = 0;
        this.mouseDragDelta = this.mouseXDragDelta + this.mouseYDragDelta;
        this.mouseDragDeadZone = 2;
        this.mouseCameraDrag = false;

        // Hover Tile
        this.hoverTile = new HoverTile();

        // Select
        this.mapSelector = new MapSelector();

        // -- Teams --
        this.teams = [];
        
        // -- Player --
        // Create team for the player
        this.teams[0] = new Team(player.team.id, GameInfo.game.player.name, player.team.cats, player.caramelWalls, World.teamColors[0]);
        this.teams[0].state = player.state.name;

        let playerStatusWidth = 400;
        let playerStatusHeight = 80;
        let playerStatusMargin = 25;
        this.playerStatus = new teamStatus(playerStatusMargin, GameInfo.height - playerStatusHeight - playerStatusMargin, playerStatusWidth, playerStatusHeight, this.teams[0].cats);
        
        // See if the player still needs to place cats
        this.unplacedCats = this.teams[0].unplacedCatsCheck();
        
        // -- Opponents --
        // Create teams for the opponent
        for (let i = 0; i < opponents.length; i++) {
            this.teams[i + 1] = new Team(opponents[i].team.id, GameInfo.game.opponents[i].name, opponents[i].team.cats, opponents[i].caramelWalls, World.teamColors[1]);
            this.teams[i].state = player.state.name;
        }

        // -- Maps --

        // Create maps
        this.maps = [];
        // Note: First map is always placement map
        for (let i = 0; i < maps.length; i++) {

            let xOffset = World.mapDrawOffsets[i][0];
            let yOffset = World.mapDrawOffsets[i][1];
            
            // If we are the placement map and are second
            if (GameInfo.game.player.order === 2 && i === 0) {
                xOffset = -xOffset * (Math.floor(maps[i+1].width * 0.5) + 1);
            }
            
            this.maps[i] = new Map (
                maps[i].width,
                maps[i].height,
                maps[i].tiles,
                xOffset,
                yOffset
            );
        }
    }
    
    draw() {
        // Get where the mouse is
        this.mouseScreenX = (mouseX - (this.cameraX * this.scale)) / this.scale;
        this.mouseScreenY = (mouseY - (this.cameraY * this.scale)) / this.scale;
        
        // Calculate the camera translation if we are dragging with the cursor
        if (mouseIsPressed === true && mouseButton === RIGHT && this.canDrag && GameInfo.isMouseOverJournal === false) { // Do this to avoid JS shenanigans
            // TODO: Potentially add arrow key support?
            this.mouseXDragDelta = this.cameraMouseStartX - mouseX;
            this.mouseYDragDelta = this.cameraMouseStartY - mouseY;
            
            this.cameraX = this.cameraX - (this.mouseXDragDelta / this.scale);
            this.cameraY = this.cameraY - (this.mouseYDragDelta / this.scale);
            
            this.cameraMouseStartX = mouseX;
            this.cameraMouseStartY = mouseY;

            // While this mouse is held down, keep track of how far we move
            if (Math.abs(this.mouseXDragDelta) + Math.abs(this.mouseYDragDelta) > this.mouseDragDelta) {
                this.mouseDragDelta = Math.abs(this.mouseXDragDelta) + Math.abs(this.mouseYDragDelta);
            }
            // Have we moved too far?
            if (this.mouseDragDelta > this.mouseDragDeadZone) {
                // Yup, we are dragging the camera
                this.mouseCameraDrag = true;
            }
            else {
                // Nope
                this.mouseCameraDrag = false;
            }
        }
        else if (GameInfo.isMouseOverJournal) {
            this.canDrag = false;
        }

        // Start of camera translation
        push();
            scale(this.scale);
            // Camera Translate
            translate(this.cameraX, this.cameraY);
            // Where we want to be looking at the start 
            translate(World.startPosX / this.scale, World.startPosY / this.scale);

            // Draw the maps
            // We need to reverse the order so that the placement map is
            // always the first being drawn
            for (let i = this.maps.length - 1; i > -1; i--) {
                if (i === 0 && this.teams[0].unplacedCatsCheck() || i > 0) {
                    this.maps[i].draw();
                }
            }

            // Draw player team caramel tiles
            this.teams[0].drawCaramelTiles();

            // Draw opponent teams caramel tiles
            for (let i = 1; i < this.teams.length; i++) {
                // The opponent information shouldn't be sent on the wrong state
                this.teams[i].drawCaramelTiles();
            }
            
            // Draw the player team
            this.teams[0].draw();

            // Draw the opponent team
            for (let i = 1; i < this.teams.length; i++) {
                // The opponent information shouldn't be sent on the wrong state
                this.teams[i].draw();
            }
            
            // Draw Hover Tile
            this.hoverTile.updatePos(this.mouseScreenX, this.mouseScreenY);

            // Draw Map Tile Select Indicator
            if (this.mapSelector.map !== null) {
                this.mapSelector.draw();

                /* if (this.mapSelector.path !== null && this.mapSelector.path !== undefined) {
                    for (let i = 0; i < this.mapSelector.path.length; i++) {
                        push();
                        translate(this.mapSelector.path[i].screenX - 60, this.mapSelector.path[i].screenY + 60);
                        fill(255, 0, 0, 255);
                        textSize(72);
                        text(i, 0, 0);
                        pop();
                    }
                } */
            }
        pop();

        // Draw the Select Info Boxes
        //this.mapSelector.drawInfoBoxes();
        this.playerStatus.draw();
    }

    getMap(map) {
        return this.maps[map];
    }

    getMapTiles(map) {
        return this.maps[map].tiles;
    }

    getFlatMapTiles(mapIndex) {
        let tiles = [];

        for (let x = 0; x < this.maps[mapIndex].tiles.length; x++) {
            for (let y = 0; y < this.maps[mapIndex].tiles[x].length; y++) {
                tiles.push(this.maps[mapIndex].tiles[x][y]);
            }
        }

        return tiles;
    }

    getTileInMap(x, y, map) {
        return this.maps[map].getTile(x, y);
    }

    getCatAliveAtCoord(x, y, map) {
        // For each team
        for (let i = 0; i < this.teams.length; i++) {
            // Try to see if there is a cat alive at the coordinate
            let cat = this.teams[i].getCatAtCoord(x, y, map);

            // Cat exists
            if (cat !== null) {
                // Is it alive?
                if (this.teams[i].cats[cat].current_health > 0) {
                    // Return the cat and the team
                    return [this.teams[i].cats[cat], this.teams[i]];
                }
            }
        }

        // If we got here it means that we could not find any cat alive at the provided coordinate
        return [];
    }

    checkTeamsCaramelTile(x, y, map) {
        for (let i = 0; i < this.teams.length; i++) {
            if (this.teams[i].checkCaramelTile(x, y, map)) {
                return true;
            }
        }

        return false;
    }

    getCatTeamIndex(cat) {
        for (let i = 0; i < this.teams.length; i++) {
            if (this.teams[i].cats.includes(cat)) {
                return i;
            }
        }

        return null;
    }

    checkOtherTeamsCaramelTile(ignoreIndex, x, y, map) {
        for (let i = 0; i < this.teams.length; i++) {
            if (i !== ignoreIndex) {
                if (this.teams[i].checkCaramelTile(x, y, map)) {
                    return true;
                }
            }
        }

        return false;
    }

    update(playerTeam, opponentTeams) {
        // Update the player team
        this.teams[0].update(playerTeam.team.cats, playerTeam.caramelWalls)

        // Update the opponent teams
        for (let i = 0; i < opponentTeams.length; i++) {
            if (this.teams[i + 1] !== undefined) {
                this.teams[i + 1].update(opponentTeams[i].team.cats, opponentTeams[i].caramelWalls);
            }
            else {
                this.teams[i + 1] = new Team(opponentTeams[i].team.id, GameInfo.game.opponents[i].name, opponentTeams[i].team.cats, opponentTeams[i].caramelWalls, World.teamColors[1]);
            }
        }

        this.updateTeamCatFaces();

        if (this.mapSelector.rangeIndicator.sourceCat !== null && this.teams[this.mapSelector.team] !== undefined) {
            this.mapSelector.updateRangeIndicators(this.teams[this.mapSelector.team].cats[this.mapSelector.cat]);
        }
    }

    updateTeamCatFaces() {
        if (this.teams.length > 1) {
            // Update the faces for both teams
            this.teams[0].updateFace(this.teams[1].cats); // Player
            this.teams[1].updateFace(this.teams[0].cats); // Opponent
        }
    }


    async keyPressed() {
        if (keyCode === ESCAPE) {
            togglePauseMenu();
        }
    }

    mousePressed() {
        this.cameraMouseStartX = mouseX;
        this.cameraMouseStartY = mouseY;
        this.canDrag = true;
    }

    mouseReleased() {

        // If we weren't dragging the camera
        if (!this.mouseCameraDrag && GameInfo.isMouseOverJournal === false) {
            // We were hovering over a valid tile
            // and not the same tile we were before
            if (this.hoverTile.map !== null
                && (this.hoverTile.coordX != this.mapSelector.coordX || this.hoverTile.coordY != this.mapSelector.coordY || this.hoverTile.map != this.mapSelector.map)
                && mouseButton === LEFT) {
                this.mapSelector.update(
                    this.hoverTile.posX,
                    this.hoverTile.posY,
                    this.hoverTile.coordX,
                    this.hoverTile.coordY,
                    this.hoverTile.map,
                );
            }
            // We weren't hovering over a valid tile
            else {
                this.mapSelector.update(null, null, null, null, null);
            }
        }

        // If we release the mouse we definitely aren't moving the camera anymore
        this.mouseCameraDrag = false;
        this.mouseDragDelta = 0;
        this.canDrag = true;
    }

    mouseClicked() {
        console.log("Click!");
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
}