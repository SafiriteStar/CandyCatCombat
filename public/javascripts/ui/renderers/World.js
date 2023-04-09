class World {
    static cameraStartPosX = 0;
    static cameraStartPosY = 0;

    static teamColors = [
        [151, 255, 175],
        [255, 151, 175]
    ];

    static mapDrawOffsets = [
        [0, Tile.height * 4],
        [0, 0]
    ]

    constructor(boards, playerTeam, opponentTeam) {
        // -- Camera & Mouse --
        this.scale = 0.2;
        
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraMouseStartX = 0;
        this.cameraMouseStartY = 0;

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
        this.teams[0] = new Team(playerTeam.team.id, GameInfo.game.player.name, playerTeam.team.cats, World.teamColors[0]);
        
        // See if the player still needs to place cats
        this.unplacedCats = this.teams[0].unplacedCatsCheck();
        
        // -- Opponents --
        // Create teams for the opponent
        for (let i = 0; i < opponentTeam.length; i++) {
            this.teams[i + 1] = new Team(opponentTeam[i].team.id, GameInfo.game.opponents[i].name, opponentTeam[i].team.cats, World.teamColors[1]);
        }

        // -- Maps --

        // Create maps
        this.maps = [];
        // Note: First map is always placement map
        for (let i = 0; i < boards.length; i++) {
            this.maps[i] = new Map (
                boards[i].width,
                boards[i].height,
                boards[i].tiles,
                World.mapDrawOffsets[i][0],
                World.mapDrawOffsets[i][1]
            );
        }
    }
    
    draw() {
        
        // Get where the mouse is
        this.mouseScreenX = (mouseX - (this.cameraX * this.scale)) / this.scale;
        this.mouseScreenY = (mouseY - (this.cameraY * this.scale)) / this.scale;
        
        // Calculate the camera translation if we are dragging with the cursor
        if (mouseIsPressed === true) { // Do this to avoid JS shenanigans
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
                this.mapSelector.drawMapTile();
            }
        pop();

        // Draw the Select Info Boxes
        this.mapSelector.drawInfoBoxes();
    }

    update(boards, playerTeam, opponentTeams) {
        // Update the maps
        for (let i = 0; i < this.maps.length; i++) {
            this.maps[i].update(boards[i].tiles);
        }

        // Update the player team
        this.teams[0].update(playerTeam.team.cats)

        // Update the opponent teams
        for (let i = 0; i < opponentTeams.length; i++) {
            this.teams[i + 1].update(opponentTeams[i].team.cats);
        }
    }

    mousePressed() {
        this.cameraMouseStartX = mouseX;
        this.cameraMouseStartY = mouseY;
    }

    mouseReleased() {

        // If we weren't dragging the camera
        if (!this.mouseCameraDrag) {
            // We were hovering over a valid tile
            // and not the same tile we were before
            if (this.hoverTile.map !== null && (this.hoverTile.coordX != this.mapSelector.coordX || this.hoverTile.coordY != this.mapSelector.coordY || this.hoverTile.map != this.mapSelector.map)) {
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