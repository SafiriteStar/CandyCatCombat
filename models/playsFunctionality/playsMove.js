const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

function getPathTiles(path, catData) {
    let pathTiles = []

    // Get the world information
    for (let i = 0; i < path.length; i++) {
        // Check if the tile exists
        if (Play.checkTileExists(path[i].x, path[i].y, path[i].map - 1)) {
            pathTiles.push(Play.worldData.maps[path[i].map - 1].tiles[path[i].x][path[i].y]);
        }
        else {
            // A tile was invalid, cancel the whole path
            return [];
        }
    }

    // Add in the tile that the cat is in (the tile we start at)
    pathTiles.unshift(Play.worldData.maps[catData.boardID - 1].tiles[catData.x][catData.y]);

    
    return pathTiles;
}

function checkNextTileIsNeighbor(currentTile, nextTile) {
    // For each connection
    for (let i = 0; i < currentTile.connections.length; i++) {
        // Check if the nextTile is a connection
        if (currentTile.connections[i].x == nextTile.x && currentTile.connections[i].y == nextTile.y && currentTile.connections[i].map == nextTile.map) {
            return true;
        }
    }
    // If we got here, none of the tiles were a neighbor
    return false;
}

Play.moveByPath = async function(game, path, catID) {
    try {
        // Are we in a state where we can move a cat?
        if (!(game.player.state.name == "Playing" || game.player.state.name == "Placement")) {
            return { status: 400, result: { msg: "You cannot move the character since its not your turn!" } };
        }

        // Get the information of the cat we are trying to move
        let catData = await Play.getGameCat(catID);
        // Is the cat dead?
        if (catData.current_health <= 0) {
            // Yes
            return { status: 400, result: { msg: "You cannot move the character since its dead!" } };
        }

        // Is the cat rooted?
        for (let i = 0; i < catData.conditions.length; i++) {
            if (catData.conditions[i].name == "Rooted") {
                // Yes
                return { status: 400, result: { msg: "You cannot move the character since its rooted!" } };
            }
        }

        // Get the world tile information of the path
        let pathTiles = getPathTiles(path, catData);

        // Did the tiles exist?
        if (pathTiles.length === 0) {
            return { status: 400, result: { msg: "You cannot move the character, the path had a nonexistent tile!" } };
        }

        // Get the caramel tile of the other teams
        let caramelTiles = [];
        for (let i = 0; i < game.opponents.length; i++) {
            // For each opponent team
            let oppCats = await Play.getGameCatTeam("opponent" + game.opponents[i].id, game.opponents[i].id, game.id);
            // Add their caramel tiles to the list
            caramelTiles = caramelTiles.concat(Play.calculateTeamCaramelWalls(oppCats.team.cats));
        }

        // For each one of those tiles (except the one we start at), append any living cats to those tiles
        // Also check for walls
        for (let i = 0; i < pathTiles.length - 1; i++) {
            // Is that tile a wall or is it filled with caramel?
            if (pathTiles[i].type == 2 || caramelTiles.includes(pathTiles[i])) {
                // Yup
                return { status: 400, result: { msg: "You cannot move the character, a path tile was a wall!" } };
            }

            pathTiles[i].cats = await Play.getCatsInTile(pathTiles[i]);
            
            // Are there cats alive in our path (except for the one we start at?)
            if (pathTiles[i].cats.length > 0) {
                // Are we at the last tile?
                if (i == pathTiles.length - 1) {
                    // Yes
                    // Doesn't matter which team the cat is on; If there is a cat there, we can't stop there
                    return { status: 400, result: { msg: "You cannot move the character since the space is already occupied!" } };
                }
                else {
                    // Is the cat an enemy?
                    for (let j = 0; j < pathTiles[i].cats.length; j++) {
                        if (pathTiles[i].cats[j].team_id != catData.team_id) {
                            // Yes
                            return { status: 400, result: { msg: "You cannot move the character, a path tile was occupied by an enemy!" } };
                        }
                    }
                }
            }
        }

        // If we got here it means
        // None of the tiles are occupied by other cats that we care about
        let staminaLeftOver = catData.stamina;

        // Are we in placement phase?
        if (game.player.state.name == "Placement") {
            // Then we need to check the path only has 2 tiles
            if (pathTiles.length > 2) {
                return { status: 400, result: { msg: "You cannot move the character, the path was too long for placement!" } };
            }

            // Are both the tiles the correct group?
            for (let i = 0; i < pathTiles.length; i++) {
                // Are they placement to begin with?
                if (pathTiles[i].group === null || pathTiles[i].group === undefined) {
                    return { status: 400, result: { msg: "You cannot move the character, the path had non placement tiles!" } };
                }
                
                // Do they not match our order and are they not a universal group?
                if (pathTiles[i].group !== game.player.order && pathTiles[i].group !== 0) {
                    return { status: 400, result: { msg: "You cannot move the character, the path had the wrong placement tiles!" } };
                }
            }
        }
        else {
            // We are in playing phase
            // We need to check that all tiles form a chain of neighbors to each other
            for (let i = 0; i < pathTiles.length - 1; i++) {
                if (!checkNextTileIsNeighbor(pathTiles[i], pathTiles[i + 1])) {
                    return { status: 400, result: { msg: "You cannot move the character, not all tiles in the path were neighbors!" } };
                }
            }

            // Do we have enough stamina to walk that far?
            if (catData.stamina < pathTiles.length - 1) {
                return { status: 400, result: { msg: "You cannot move the character, not enough stamina!" } };
            }

            // Take away a point of stamina for how far we walked
            staminaLeftOver = staminaLeftOver - (pathTiles.length - 1);
        }

        // If we got here, everything is okay!
        // Move the cat to the new tile
        await pool.query(
            `Update game_team_cat set gtc_x = ?, gtc_y = ?, gtc_game_board_id = ?, gtc_stamina = ? where gtc_id = ?`,
                [pathTiles[pathTiles.length - 1].x, pathTiles[pathTiles.length - 1].y, pathTiles[pathTiles.length - 1].map, staminaLeftOver, catID]);

        return { status: 200, result: { msg: "Move success!", stamina: staminaLeftOver } }

    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

Play.move = async function(game, path, catID) {
    try {
        result = await Play.moveByPath(game, path, catID);

        return result;
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}