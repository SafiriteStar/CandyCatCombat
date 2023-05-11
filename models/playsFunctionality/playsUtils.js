const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

Play.setWorldData = async function(worldCreator, argv1, argv2) {
    Play.worldData = await worldCreator(argv1, argv2);
}

Play.getWorld = function() {
    return Play.worldData;
}

Play.checkTileExists = function(x, y, map) {
    if (Play.worldData.maps[map] === null || Play.worldData.maps[map] === undefined) {
        return false;
    }
    
    if (Play.worldData.maps[map].tiles[x] === null || Play.worldData.maps[map].tiles[x] === undefined) {
        return false;
    }
    
    if (Play.worldData.maps[map].tiles[x][y] === null || Play.worldData.maps[map].tiles[x][y] === undefined) {
        return false;
    }

    return true;
}

Play.getTile = function(x, y, map) {
    return Play.worldData.maps[map].tiles[x][y];
}

Play.addCondition = async function(catID, conditionID, duration) {
    await pool.query(
        `Insert into game_team_cat_condition (gcc_gtc_id, gcc_ccn_id, gcc_duration) values (?, ?, ?)`,
            [catID, conditionID, duration]);
}

Play.removeCondition = async function(catConditionID) {
    await pool.query(`
        Delete from game_team_cat_condition where gcc_id = ?`,
            [catConditionID]);
}

Play.setConditionDuration = async function(catConditionID, duration) {
    console.log("Game ID: " + catConditionID);
    console.log("Duration: " + duration);
    await pool.query(
        `Update game_team_cat_condition set gcc_duration = ? where gcc_id = ?`,
            [duration, catConditionID]);
}

Play.tickConditionDuration = async function(catConditionID, change) {
    // Get the condition we are trying to update
    let [[conditionDB]] = await pool.query(`Select gcc_duration as "duration" from game_team_cat_condition where gcc_id = ?`, [catConditionID]);
    
    // Is the condition about to expire or expired already and are we subtracting?
    if (conditionDB.duration <= 0 && change < 0) {
        // Yes
        // Remove it
        await Play.removeCondition(catConditionID);
    }
    else {
        // No
        // Update its duration
        await pool.query(
            `Update game_team_cat_condition set gcc_duration = gcc_duration + ? where gcc_id = ?`,
                [change, catConditionID]);
    }

}

Play.applyDamage = async function(damage, catDBID) {
    await pool.query(`Update game_team_cat set gtc_current_health = gtc_current_health + ? where gtc_id = ?`,
        [damage, catDBID]);

    let catData = Play.askForCat(catDBID);

    // Wait did the cat die?
    if (catData.current_health <= 0) {
        // Yes
        // Set it to dead (id: 3)
        await pool.query(`Update game_team_cat set gtc_state_id = 3 where gtc_id = ?`, [catDBID]);
    }
}

Play.adjustStamina = async function(catID, staminaAdjustment) {
    await pool.query(`Update game_team_cat set gtc_stamina = gtc_stamina + ? where gtc_id = ?`, [staminaAdjustment, catID]);
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
// conditions [ { name, duration, id, game_id } ]
Play.getGameCat = async function(catId) {
    let askForCat = `
    Select
        gtc_id as "id",               gtc_type_id as "type",          gtc_x as "x",                           gtc_y as "y",
        cat_name as "name",           cat_max_health as "max_health", gtc_current_health as "current_health", cat_damage as "damage",
        cat_defense as "defense",     cat_speed as "speed",           gtc_stamina as "stamina",               cat_min_range as "min_range",
        cat_max_range as "max_range", cat_cost as "cost",             gcs_state as "state",                   gtc_game_board_id as "boardID",
        gtc_game_team_id as "team_id", cat_description as "description"
    from
        cat,
        game_cat_state,
        game_team_cat,
        game_team
    where
        gtc_type_id = cat_id AND
        gtc_state_id = gcs_id AND
        gtc_game_team_id = gt_id AND
        gtc_id = ?`

    let [[gameCat]] = await pool.query(askForCat, [catId]);

    let askForGameCatConditions = `Select ccn_name as "name", gcc_duration as "duration", gcc_ccn_id as "id", gcc_id as "game_id"
    from game_team_cat, game_team_cat_condition, cat_condition
    where gcc_ccn_id = ccn_id and gtc_id = gcc_gtc_id and gcc_gtc_id = ?`
    // Ask for the conditions for that cat (even if empty)
    // For each cat
    
    let [gameCatConditions] = await pool.query(askForGameCatConditions, [catId]);

    gameCat.conditions = gameCatConditions;

    return gameCat;
}

Play.getGameCatTeam = async function(teamOwnershipType, playerId, gameId) {
    let askForCatTeam = 'select gtc_id as "id", gtc_type_id as "type", gtc_x as "x", gtc_y as "y", cat_name as "name", cat_max_health as "max_health", gtc_current_health as "current_health", cat_damage as "damage", cat_defense as "defense", cat_speed as "speed", gtc_stamina as "stamina", cat_min_range as "min_range", cat_max_range as "max_range", cat_cost as "cost", gcs_state as "state", gtc_game_board_id as "boardID", gtc_game_team_id as "team_id", cat_description as "description" from cat, game_team_cat, game_cat_state where gtc_type_id = cat_id and gtc_state_id = gcs_id and gtc_game_team_id = ?'

    // Player info
    let player = {};
    player.ownership = teamOwnershipType;
    // Get the game_team id made for the player
    let [[playerGameTeamData]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_game_id = ?",
        [gameId, playerId]);

    // Get a list of cats in the player's game team
    player.team = {};
    // Save the team id
    player.team.id;
    player.team.id = playerGameTeamData.gt_id;
    player.team.cats = [];

    [player.team.cats] = await pool.query(askForCatTeam, [player.team.id]);

    // Ask for the conditions for that cat (even if empty)
    // For each cat
    for (let i = 0; i < player.team.cats.length; i++) {
        player.team.cats[i].conditions = [];
        [player.team.cats[i].conditions] = await pool.query(
            `select ccn_name as "name", gcc_duration as "duration", gcc_ccn_id as "id", gcc_id as "game_id"
            from game_team_cat, game_team_cat_condition, cat_condition
            where gcc_ccn_id = ccn_id and gtc_id = gcc_gtc_id and gcc_gtc_id = ?`,
                [player.team.cats[i].id]);
    }

    return player
}

Play.getCatsInTile = async function(tile, gameId) {
    let askForCats = `
    Select
        gtc_id as "id",               gtc_type_id as "type",          gtc_x as "x",                           gtc_y as "y",
        cat_name as "name",           cat_max_health as "max_health", gtc_current_health as "current_health", cat_damage as "damage",
        cat_defense as "defense",     cat_speed as "speed",           gtc_stamina as "stamina",               cat_min_range as "min_range",
        cat_max_range as "max_range", cat_cost as "cost",             gcs_state as "state",                   gtc_game_board_id as "boardID",
        gtc_game_team_id as "team_id"
    from
        cat,
        game_cat_state,
        game_team_cat_condition,
        cat_condition,
        game_team_cat,
        game_team,
        game
    where
        gtc_type_id = cat_id AND
        gtc_state_id = gcs_id AND
        gcc_ccn_id = ccn_id AND
        gtc_id = gcc_gtc_id AND
        gtc_game_team_id = gt_id AND
        gt_game_id = gm_id AND
        gtc_current_health > 0 AND
        gm_id = ? AND
        gtc_x = ? AND
        gtc_y = ? AND
        gtc_game_board_id = ?`

    let [cats] = await pool.query(askForCats, [gameId, tile.x, tile.y, tile.map]);

    return cats;
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
Play.getNeighborTiles = function(tilesToCheck, ignoreWalls) { //CALL THIS FUNCTION ON MOVE
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

// Returns an array of layers, each layer containing its neighbors
Play.getNeighborsOfRange = function(sourceTile, maxRange, minRange, ignoreWalls) {
    let tiles = [];
    let neighbors = [];

    // Add in the first tile
    tiles.push(sourceTile);

    // For however many layers we want to search
    for (let i = 0; i < maxRange; i++) {
        // Find some neighbors
        let newNeighbors = Play.getNeighborTiles(tiles, ignoreWalls);
        // Add them
        tiles = tiles.concat(newNeighbors);
        // And if we are at or above our minimum range, add them to the highlighted tiles as well
        if (minRange - 2 < i) {
            neighbors[i] = newNeighbors;
        }
    }

    return neighbors;
}

function catFilterNeighborCheck(cat, filters) {
    // Do we have filters?
    if (filters !== null && filters !== undefined) {
        // Yes
        // For every filter
        for (let i = 0; i < filters.length; i++) {
            if (filters[i](cat) === false) {
                // If the filter fails (returns false), we want to also fail
                return false;
            }
        }

        // If we got here, we passed all filters
        return true;
    }
    else {
        // No
        // If we aren't checking for anything then its all good right?
        return true;
    }
}

// Returns the an array of indexes for neighbors at the given x and y
Play.getCatNeighbors = function(potentialNeighborCats, neighborTiles, filters) {
    let neighborCats = []

    // For each cat
    potentialNeighborCats.forEach(function(cat, catIndex) {
        // May we move on?
        if (!catFilterNeighborCheck(cat, filters)) {
            // Nope!
            // Do not add anything, just return out of this current foreach iteration 
            return;
        }   
        // We want to check if they are in any of our neighbor tiles
        neighborTiles.forEach(function(layer, layerIndex) {
            // Does that layer have our cat?
            if (layer.includes(Play.getTile(cat.x, cat.y, cat.boardID - 1))) {
                // Yes
                // Add the cat and layer into the list
                neighborCats.push({index:catIndex, distance:layerIndex});
            }
        });
    });
    

    // Return the list of index neighbors
    return neighborCats;
}

Play.countLiveCats = async function (playerID, gameID) {
    // Get the team we are looking for
    let playerTeam = await Play.getGameCatTeam("player", playerID, gameID);

    let count = 0;

    // For each cat in that team
    playerTeam.team.cats.forEach(cat => {
        // If its dead
        if (cat.current_health > 0) {
            // Add to the score
            count++;
        }
    });

    // Return the score
    return count;
}

Play.countDeadCats = async function (playerID, gameID) {
    // Get the team we are looking for
    let playerTeam = await Play.getGameCatTeam("player", playerID, gameID);

    let countDeadCats = 0;

    // For each cat in that team
    playerTeam.team.cats.forEach(cat => {
        // If its dead
        if (cat.current_health <= 0) {
            // Add to the score
            countDeadCats++;
        }
    });

    // Return the score and length of the team
    return [countDeadCats, playerTeam.team.cats.length];
}