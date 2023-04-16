const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

Play.setWorldData = async function(worldCreator, argv1, argv2) {
    Play.worldData = await worldCreator(argv1, argv2);
}

Play.getWorld = function() {
    return Play.worldData;
}

Play.getTile = function(x, y, map) {
    return Play.worldData.maps[map].tiles[x][y];
}

// Returns a game cat team of the given player (if any)
// Cat stats are:
// id
// type
// x
// y
// name
// max_health
// current_health
// damage
// defense
// speed
// stamina
// min_range
// max_range
// cost
// state
// boardID
Play.getGameCatTeam = async function(teamOwnershipType, playerId, gameId) {
    let askForCatTeam = 'select gtc_id as "id", gtc_type_id as "type", gtc_x as "x", gtc_y as "y", cat_name as "name", cat_max_health as "max_health", gtc_current_health as "current_health", cat_damage as "damage", cat_defense as "defense", cat_speed as "speed", gtc_stamina as "stamina", cat_min_range as "min_range", cat_max_range as "max_range", cat_cost as "cost", gcs_state as "state", gtc_game_board_id as "boardID" from cat, game_team_cat, game_cat_state where gtc_type_id = cat_id and gtc_state_id = gcs_id and gtc_game_team_id = ?'

    // Player info
    let player = {};
    player.ownership = teamOwnershipType;

    // Get the game_team id made for the player
    let [[playerGameTeamData]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_id = ?",
        [gameId, playerId]);

    // Get a list of cats in the player's game team
    player.team = {};
    // Save the team id
    player.team.id;
    player.team.id = playerGameTeamData.gt_id;
    player.team.cats = [];

    [player.team.cats] = await pool.query(askForCatTeam, [player.team.id]);

    return player
}

Play.changePlayerState = async function(stateID, playerID) {
    await pool.query(`Update user_game set ug_state_id = ? where ug_id = ?`,
            [stateID, playerID]);
}

Play.checkPlayersReady = async function(gameID) {
    let [dbPlayers] = await pool.query(
        `select ug_state_id as "state"
        from user_game
        where ug_game_id = ?`,
            [gameID]
    );

    for (let i = 0; i < dbPlayers.length; i++) {
        if (dbPlayers[i].state != 2) {
            // Player isn't ready yet
            return false
        }
    }
    // We got here if all players were ready
    return true;
}

Play.changePlayerStateByOrder = async function(order, playerID) {
    // Is the player the first to go
    if (order == 1) {
        // Yup
        // Change player state to playing (4)
        await Play.changePlayerState(4, playerID);
    }
    else {
        // Nope
        // Change player state to waiting (3)
        await Play.changePlayerState(3, playerID);
    }
}

// Returns a list of neighboring tiles
Play.getNeighborTiles = function(tilesToCheck, ignoreWalls) {
    let newNeighbors = [];

    // For each tile
    tilesToCheck.forEach(tile => {
        // For each connection of that tile
        tile.connections.forEach(neighbor => {
            // Get the actual tile data
            let currentTile = Play.getTile(neighbor.x, neighbor.y, neighbor.map - 1);
            
            // If its not in tiles already
            // and not on our new neighbor list
            // and we are either ignoring walls OR aren't ignoring walls and the tile we are looking at isn't a wall
            if (!tilesToCheck.includes(currentTile) && !newNeighbors.includes(currentTile) && (ignoreWalls || (!ignoreWalls && currentTile.type != 2))) {
                // Add that neighbor
                newNeighbors.push(currentTile);
            }
        });
    });

    return newNeighbors
}

// Returns the an array of indexes for neighbors at the given x and y
Play.getCatNeighbors = function(potentialNeighborCats, neighborTiles) {
    let neighborCats = []

    function checkCatIsNeighbor(cat, index) {
        // Check if the tile the cat is on is a neighbor
        if (neighborTiles.includes(Play.getTile(cat.x, cat.y, cat.boardID - 1))) {
            // Tile is a neighbor!
            // Add the cat to the list
            neighborCats.push(index);
        }
    }
    
    // For each potential neighbor
    potentialNeighborCats.forEach(checkCatIsNeighbor);

    // Return the list of index neighbors
    return neighborCats;
}

Play.getNeighborsOfRange = function(sourceTile, maxRange, minRange) {
    let tiles = [];
    let neighbors = [];

    // Add in the first tile
    tiles.push(sourceTile);

    // For however many layers we want to search
    for (let i = 0; i < maxRange; i++) {
        // Find some neighbors
        let newNeighbors = Play.getNeighborTiles(tiles);
        // Add them
        tiles = tiles.concat(newNeighbors);
        // And if we are at or above our minimum range, add them to the highlighted tiles as well
        if (minRange - 2 < i) {
            neighbors = neighbors.concat(newNeighbors);
        }
    }

    return neighbors;
}

Play.distanceBetweenPoints = function(tile1, tile2) {
    let x1 = tile1.x;
    let y1 = tile1.y;
    let x2 = tile2.x;
    let y2 = tile2.y;

    
}