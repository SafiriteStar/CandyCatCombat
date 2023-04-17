const pool = require("../config/database");

// auxiliary function to check if the game ended 
async function checkEndGame(game) {
    return game.turn >= Play.maxNumberTurns;
}

class Play {
    // At this moment I do not need to store information so we have no constructor

    // Just a to have a way to determine end of game
    static maxNumberTurns = 10;
    // we consider all verifications were made

    // Load in a team for the player or opponents using their default teams
    static async #loadCatTeam(gameId, playerId) {

        // ADd in a new game team
        await pool.query(
            'Insert into game_team (gt_game_id, gt_user_id) values (?, ?)',
            [gameId, playerId]);
        
        // Get the game_team ID made for the player
        let [[playerGameTeam]] = await pool.query("Select * from game_team where gt_game_id = ? and gt_user_id = ?",
            [gameId, playerId]
        );

        // Get the players default team
        let [playerDefaultTeam] = await pool.query(
            "Select tmc_cat_id from team_cat where tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)",
            [playerId]
        );
        
        // Add the cats in the default team to game_team_cat
        for (let i = 0; i < playerDefaultTeam.length; i++) {
            // Get the data of the current cat
            let [[currentCat]] = await pool.query('Select * from cat where cat_id = ?', [playerDefaultTeam[i].tmc_cat_id]);

            // Add that cat to the game team, default to the placement board (1)
            await pool.query(
                `Insert into game_team_cat (
                    gtc_game_team_id,
                    gtc_type_id,
                    gtc_current_health,
                    gtc_stamina,
                    gtc_x,
                    gtc_y,
                    gtc_game_board_id
                )
                values (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        playerGameTeam.gt_id,       // gtc_game_team_id
                        currentCat.cat_id,          // gtc_type_id
                        currentCat.cat_max_health,  // gtc_current_health
                        currentCat.cat_speed,       // gtc_stamina
                        i,                          // gtc_x
                        0,                          // gtc_y
                        1                           // gtc_game_board_id
                    ]);
        }
    }

    static async startGame(game) {
        try {
            // Randomly determines who starts    
            let myTurn = (Math.random() < 0.5);
            let p1Id = myTurn ? game.player.id : game.opponents[0].id;
            let p2Id = myTurn ? game.opponents[0].id : game.player.id;

            // Player
            await Play.#loadCatTeam(game.id, game.player.id);
            
            // Opponents (can do multiple but you should only have one)
            for (let i = 0; i < game.opponents.length; i++) {
                await Play.#loadCatTeam(game.id, game.opponents[i].id);
            }

            // Player that start changes to order 1 
            await pool.query(`Update user_game set ug_order=? where ug_id = ?`, [1, p1Id]);
            // Player that is second changes to order 2
            await pool.query(`Update user_game set ug_order=? where ug_id = ?`, [2, p2Id]);

            // Changing the game state to start
            await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [2, game.id]);

            // ---- Specific rules for each game start bellow
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async #getBoardData(boardID) {
        // Get the main map the players are playing on
        let [[dbBoardData]] = await pool.query(
            `Select brd_id, max(tile_x) + 1 as "width", max(tile_y) + 1 as "height"
            from board, tile
            where brd_id = ? and tile_board_id = brd_id`,
                [boardID]);
    
        // The game parameter comes with the game id. So lets get the tiles of the board from the game id.
        let [dbTileData] = await pool.query(
            `Select tile_x as "x", tile_y as "y", tile_type_id as "type"
            from tile
            where tile_board_id = ?`,
                [boardID]);

        let [dbPlacementTileData] = await pool.query(
            `Select ptg_tile_x as "x", ptg_tile_y as "y", ptg_group as "group"
            from placement_tile_group
            where ptg_tile_board_id = ?`,
                [boardID]);
        
        let board = {}
        board.width = dbBoardData.width;
        board.height = dbBoardData.height;
        board.tiles = [];

        // Index for the db array
        let tileIndex = 0;

        // Add all the tiles
        for (let i = 0; i < dbBoardData.width; i++) {
            board.tiles[i] = [];
            for (let j = 0; j < dbBoardData.height; j++) {
                board.tiles[i][j] = dbTileData[tileIndex];
                tileIndex++;
            }
        }

        // After adding all the tiles we need to adjust the placement tiles so that they know what group they are in
        for (let i = 0; i < dbPlacementTileData.length; i++) {
            board.tiles[dbPlacementTileData[i].x][dbPlacementTileData[i].y].group = dbPlacementTileData[i].group;
        }

        return board;
    }

    static async #getGameCatTeam(teamOwnershipType, playerId, gameId) {
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
        player.team.cats;

        [player.team.cats] = await pool.query(askForCatTeam, [player.team.id]);

        return player
    }

    static async getBoard(game) {
        try {
            let boardData = {}
            boardData.boards = []

            // -- PLACEMENT BOARD --
            // Get the placement map
            boardData.boards[0] = await Play.#getBoardData(1)
            
            // -- MAIN BOARD --
            // Get the main map the players are playing on
            boardData.boards[1] = await Play.#getBoardData(game.board + 1);

            // Player info
            boardData.player = await Play.#getGameCatTeam("player", game.player.id, game.id);

            // Opponents
            boardData.opponents = [];

            // If we are in a state that we are allowed to see our opponents
            if (game.player.state.name == "Playing" || game.player.state.name == "Waiting" || game.player.state.name == "Score" || game.player.state.name == "End") {
                for (let i = 0; i < game.opponents.length; i++) {
                    boardData.opponents[i] = await Play.#getGameCatTeam("opponent" + game.opponents[i].id, game.opponents[i].id, game.id);
                }
            }
            
            return { status: 200, result: boardData};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async #changePlayerState(stateID, playerID) {
        await pool.query(`Update user_game set ug_state_id = ? where ug_id = ?`,
                [stateID, playerID]);
    }

    static async #checkPlayersReady(gameID) {
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

    static async #changePlayerStateByOrder(order, playerID) {
        // Is the player the first to go
        if (order == 1) {
            // Yup
            // Change player state to playing (4)
            await Play.#changePlayerState(4, playerID);
        }
        else {
            // Nope
            // Change player state to waiting (3)
            await Play.#changePlayerState(3, playerID);
        }
    }

    static async endPlacement(game) {
        try {
            // Change the player to be ready
            await Play.#changePlayerState(2, game.player.id);

            // Check if all players are ready
            if (await Play.#checkPlayersReady(game.id)) {

                // Set the player's order
                await Play.#changePlayerStateByOrder(game.player.order, game.player.id);
                
                // For each opponent
                for (let i = 0; i < game.opponents.length; i++) {
                    // Set their order
                    await Play.#changePlayerStateByOrder(game.opponents[i].order, game.opponents[i].id);
                }
            }

            return { status: 200, result: { msg: "You readied up." } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // This considers that only one player plays at each moment, 
    // so ending my turn starts the other players turn
    // We consider the following verifications were already made:
    // - The user is authenticated
    // - The user has a game running
    // NOTE: This might be the place to check for victory, but it depends on the game
    static async endTurn(game) {
        try {
            // Change player state to waiting (3)
            Play.#changePlayerState(3, game.player.id);
            Play.#changePlayerState(4, game.opponents[0].id);

            // Both players played
            if (game.player.order == 2) {
                // Criteria to check if game ended
                if (await checkEndGame(game)) {
                    return await Play.endGame(game);
                } else {
                    // Increase the number of turns and continue 
                    await pool.query(`Update game set gm_turn = gm_turn + 1 where gm_id = ?`,
                        [game.id]);
                }
            }

            return { status: 200, result: { msg: "Your turn ended." } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async move(game, x, y, map, catID, teamID) {
       try {
            let [selectedCats] = await pool.query(
                `Select *
                from game_team_cat
                where gtc_id = ?`,
                [catID]
            );

            // Check if any cats with those ID's exist
            if (selectedCats.length > 1) {
                return { status: 400, result: {msg:"You cannot move the character since the chosen character is not valid"} };
            }

            // Get the cat that was returned
            let selectedCat = selectedCats[0];

            // Dead cats can't be moved
            if (selectedCat.gtc_state_id === 3) {
                return { status: 400, result: {msg:"You cannot move the character since it is dead"} };
            }




            // Ask for the tile data at the coordinates
            let [tiles] = await pool.query(
                `Select *
                from tile
                where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                [x, y, map]
            );

            // Does the tile exist?
            if (tiles.length === 0) {
                return { status: 400, result: {msg: "You cannot move the selected character there since it's not a tile"} };
            }

            // Store the data
            let tile = tiles[0]

            if (selectedCat.gtc_game_board_id === 1) {
                if (tile.tile_type_id != 3) {
                    return { status: 400, result: {msg: "You cannot move the selected character there since it's not a valid position"} };
                }

                await pool.query(
                    `Update game_team_cat set gtc_game_board_id = 2 where gtc_id = ?`,
                    [catID]
                );
            }
            else {
                if (selectedCat.gtc_game_board_id !== 2) {
                    return { status: 400, result: {msg:"You cannot move the character since the chosen coordinate is not valid"} };
                }
                // Is the target tile not next to the cat?
                if (!this.isNeighbor(selectedCat.gtc_x, selectedCat.gtc_y, x, y)) {
                    return { status: 400, result: {msg:"You cannot move the character since the chosen coordinate is not valid"} };
                }
            }

            // Is the tile a wall?
            if (tile.tile_type_id === 2) { // 2 = wall
                return { status: 400, result: {msg: "You cannot move the selected character there since it's a wall"} };
            }

            // Is there a cat already at the target tile?
            let [cats] = await pool.query(
                `Select gtc_x, gtc_y
                from game, game_team, game_team_cat
                where gtc_x = ? and gtc_y = ? and gtc_game_board_id = ? and gt_id = ?`,
                [x, y, map, teamID]
            );

            // TODO: Add an above "0" health check
            if (cats.length > 1 && map !== 1) {
                return { status: 400, result: {msg: "You cannot move the selected character there since there's already another character occupying that tile"} };
            }

            // Update the cat info
            let stamina = selectedCat.gtc_stamina - 1;
            await pool.query(
                `Update game_team_cat set gtc_x = ?, gtc_y = ?, gtc_game_board_id = ?, gtc_stamina = ? where gtc_id = ?`,
                [x, y, map, stamina, catID]
            );

            return {
                status: 200, 
                result: {
                    "stamina": stamina,
                    "x": x,
                    "y": y
                }     
            };
    
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static isNeighbor(originX, originY, targetX, targetY) {

        // if (game.ugst_state === "Placement") {
        //     if (tile.tile_type_id !== 3) {
        //         return { status: 400, result: {msg: "You cannot move characters outside the placement tiles while on the placement fase"}}
        //     }
        // }


        if (originX == targetX && originY == targetY + 1) { // middle up tile
            return true;
        }

        if (originX == targetX && originY == targetY - 1) { // middle down tile
            return true;
        }

        if (originX == targetX - 1 && originY == targetY) { // left tile
            return true;
        }

        if (originX == targetX + 1 && originY == targetY) { // right tile
            return true;
        }

        // If the originX is an even number
        if (originX % 2 === 0 && originY === targetY - 1) { // right up tile
            if (originX === targetX + 1) {
                return true;
            }
    
            if (originX === targetX - 1) { // left up tile
                return true;
            }
        }

        // If the originX is an odd number
        else if(Math.abs(originX % 2) === 1 && originY === targetY + 1) { // right down tile
            if (originX === targetX + 1) {
                return true;
            }
    
            if (originX === targetX - 1) { // left down tile
                return true;
            }
        }

        return false;
    }

    // Makes all the calculation needed to end and score the game
    static async endGame(game) {
        try {
            // Both players go to score phase (id = 5)
            let sqlPlayer = `Update user_game set ug_state_id = ? where ug_id = ?`;
            await pool.query(sqlPlayer, [4, game.player.id]);
            await pool.query(sqlPlayer, [4, game.opponents[0].id]);
            // Set game to finished (id = 3)
            await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [3, game.id]);

            // Insert score lines with the state and points.
            // For this template both are  tied (id = 1) and with one point 
            let sqlScore = `Insert into scoreboard (sb_user_game_id,sb_state_id,sb_points) values (?,?,?)`;
            await pool.query(sqlScore, [game.player.id,1,1]);
            await pool.query(sqlScore, [game.opponents[0].id,1,1]);

            return { status: 200, result: { msg: "Game ended. Check scores." } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}

module.exports = Play;