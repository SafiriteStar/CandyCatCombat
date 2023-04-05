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
    static async startGame(game) {
        try {
            // Randomly determines who starts    
            let myTurn = (Math.random() < 0.5);
            let p1Id = myTurn ? game.player.id : game.opponents[0].id;
            let p2Id = myTurn ? game.opponents[0].id : game.player.id;

            // Load in a team for the player and all opponents using their default teams
            // Player
            await pool.query(
                'Insert into game_team (gt_game_id, gt_user_id) values (?,?)',
                [game.id, game.player.id]);
            
            // Get the game_team id made for the player
            let [[playerGameTeam]] = await pool.query("Select * from game_team where gt_game_id = ? and gt_user_id = ?",
                [game.id, game.player.id]
            );
            // Get the players default team
            let [playerDefaultTeam] = await pool.query(
                "Select tmc_cat_id from team_cat where tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)",
                [game.player.id]
            );
            
            // Add the cats in the default team to game_team_cat
            for (let i = 0; i < playerDefaultTeam.length; i++) {
                // Get the data of the current cat
                let [[currentCat]] = await pool.query('Select * from cat where cat_id = ?', [playerDefaultTeam[i].tmc_cat_id]);
                // playerDefaultTeam[i]
                // Add that cat to the game team
                await pool.query('Insert into game_team_cat (gtc_game_team_id, gtc_type_id, gtc_current_health, gtc_stamina, gtc_placement_x, gtc_placement_y) values (?, ?, ?, ?, ?, ?)',
                    [playerGameTeam.gt_id, currentCat.cat_id, currentCat.cat_max_health, currentCat.cat_speed, i, 0]);
            }
            
            // Opponents (can do multiple but you should only have one)
            for (let i = 0; i < game.opponents.length; i++) {
                await pool.query(
                    'Insert into game_team (gt_game_id, gt_user_id) values (?,?)',
                    [game.id, game.opponents[i].id]);
                
                // Get the game_team id made for the player
                let [[opponentGameTeam]] = await pool.query("Select * from game_team where gt_game_id = ? and gt_user_id = ?",
                    [game.id, game.opponents[i].id]
                );
                // Get the players default team
                let [opponentDefaultTeam] = await pool.query(
                    "Select tmc_cat_id from team_cat where tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)",
                    [game.opponents[i].id]
                );
                
                // Add the cats in the default team to game_team_cat
                for (let j = 0; j < opponentDefaultTeam.length; j++) {
                    // Get the data of the current cat
                    let [[currentCat]] = await pool.query('select * from cat where cat_id = ?', [opponentDefaultTeam[j].tmc_cat_id]);
                    // playerDefaultTeam[i]
                    // Add that cat to the game team
                    await pool.query('Insert into game_team_cat (gtc_game_team_id, gtc_type_id, gtc_current_health, gtc_stamina, gtc_placement_x, gtc_placement_y) values (?, ?, ?, ?, ?, ?)',
                        [opponentGameTeam.gt_id, currentCat.cat_id, currentCat.cat_max_health, currentCat.cat_speed, j, 0]);
                }
            }

            // Player that start changes to the state Playing and order 1 
            await pool.query(`Update user_game set ug_state_id=?,ug_order=? where ug_id = ?`, [2, 1, p1Id]);
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

    static async getBoard(game) {
        try {
            let board = {};
            [[board]] = await pool.query('Select brd_id, max(tile_x) + 1 as "width", max(tile_y) + 1 as "height" from game, board, tile where brd_id = gm_board_id and tile_board_id = brd_id and gm_id = ?',
                [game.id]);
            
            // The game parameter comes with the game id. So lets get the board from the game id.
            let [databaseTiles] = await pool.query(
                'Select tile_x as "x", tile_y as "y", tile_type_id as "type" from game, tile where tile_board_id = gm_board_id and gm_id = ?',
                    [game.id]
            );

            let [dbPlacementTiles] = await pool.query(
                'Select ptg_tile_x as "x", ptg_tile_y as "y", ptg_group as "group" from placement_tile_group where ptg_tile_board_id = ?',
                    [game.board]
            );

            board.tiles = [];
            let tileIndex = 0;

            // Add all the tiles
            for (let i = 0; i < board.width; i++) {
                board.tiles[i] = [];
                for (let j = 0; j < board.height; j++) {
                    board.tiles[i][j] = databaseTiles[tileIndex];
                    tileIndex++;
                }
            }

            // After adding all the tiles we need to adjust the placement tiles so that they know what group they are in
            for (let i = 0; i < dbPlacementTiles.length; i++) {
                board.tiles[dbPlacementTiles[i].x][dbPlacementTiles[i].y].group = dbPlacementTiles[i].group;
            }

            // Lets avoid repeated strings shall we?
            let askForCatTeam = 'select gtc_id as "id", gtc_type_id as "type", gtc_x as "x", gtc_y as "y", cat_name as "name", cat_max_health as "max_health", gtc_current_health as "current_health", cat_damage as "damage", cat_defense as "defense", cat_speed as "speed", gtc_stamina as "stamina", cat_min_range as "min_range", cat_max_range as "max_range", cat_cost as "cost", gcs_state as "state", gtc_placement_x as "placementX", gtc_placement_y as "placementY" from cat, game_team_cat, game_cat_state where gtc_type_id = cat_id and gtc_state_id = gcs_id and gtc_game_team_id = ?'

            // Player info
            board.player = {};

            // Get the game_team id made for the player
            let [[playerGameTeamData]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_id = ?",
                [game.id, game.player.id]);

            // Get a list of cats in the player's game team
            board.player.team = {};
            // Save the team id
            board.player.team.id;
            board.player.team.id = playerGameTeamData.gt_id;
            board.player.team.cats;

            [board.player.team.cats] = await pool.query(askForCatTeam,
                [board.player.team.id]);

            // Opponents
            board.opponents = [];

            for (let i = 0; i < game.opponents.length; i++) {
                // Get the game_team id made for the opponent
                let [[opponentGameTeamData]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_id = ?",
                    [game.id, game.opponents[i].id]);

                // Get a list of cats in the opponent's game team
                board.opponents[i] = {};
                // Initialize team
                board.opponents[i].team = {};
                // Save team id
                board.opponents[i].team.id;
                board.opponents[i].team.id = opponentGameTeamData.gt_id;
                board.opponents[i].team.cats;

                [board.opponents[i].team.cats] = await pool.query(askForCatTeam,
                    [board.opponents[i].team.id]);
            }
            
            return { status: 200, result: board};
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
            // Change player state to waiting (1)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [1, game.player.id]);
            // Change opponent state to playing (2)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [2, game.opponents[0].id]);

            // Both players played
            if (game.player.order == 2) {
                // Criteria to check if game ended
                if (await checkEndGame(game)) {
                    return await Play.endGame(game);
                } else {
                    // Increase the number of turns and continue 
                    await pool.query(`Update game set gm_turn=gm_turn+1 where gm_id = ?`,
                        [game.id]);
                }
            }

            return { status: 200, result: { msg: "Your turn ended." } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // static async selectTeam(game, characterId, teamId) {
    //     try {
    //         let [[row]] = await pool.query(
    //             `select * from game_team where gtc_id = ?`,
    //             [teamId]
    //         );
    //         if (!row)
    //             return { status: 400, result: {msg:"You cannot selected that team since the chosen team is not valid"} };
            
    //         await pool.query(
    //             `update game_team_cat set gtc_game_team_id = ? where gtc_id = ?`,
    //             [teamId, characterId]
    //         );

    //         return { 
    //             status: 200, 
    //             result: {
    //                 "characterId": characterId
    //             }
    //         }

    //     } catch (err) {
    //         console.log(err);
    //         return { status: 500, result: err };
    //     }
    // }

    static async move(game, x, y, placementX, placementY, catID) {
       try {
            let [selectedCats] = await pool.query(
                `Select gtc_x, gtc_y, gtc_stamina
                from game_team_cat
                where gtc_id = ?`,
                [catID]
            );
            // Check if any cats with those ID's exist
            if (selectedCats.length > 1 || selectedCats.length <= 0) {
                return { status: 400, result: {msg:"You cannot move character since the chosen character is not valid"} };
            }

            // Get the cat that was returned
            let selectedCat = selectedCats[0];

            // Is the target tile not next to the cat?
            if (!this.isNeighbor(selectedCat.gtc_x, selectedCat.gtc_y, x, y)) {
                return { status: 400, result: {msg:"You cannot move character since the chosen coordinate is not valid"} };
            }

            // Ask for the tile data at the coordinates
            let [tiles] = await pool.query(
                `Select *
                from tile
                where tile_x = ? and tile_y = ?`,
                [x, y]
            );

            // Store the data
            let tile = tiles[0]

            // Does the tile exist?
            if (tile === null) {
                return { status: 400, result: {msg: "You cannot move the selected character there since it's not a tile"} };
            }

            // Is the tile a wall?
            if (tile.type_id == 1) { // 1 = wall
                return { status: 400, result: {msg: "You cannot move the selected character there since it's a wall"} };
            }
    
            // Is there a cat already at the target tile?
            let [cats] = await pool.query(
                `Select gtc_x, gtc_y
                from game, game_team, game_team_cat
                where gm_id = ? and gt_game_id = gm_id and gtc_game_team_id = gt_id and gtc_x = ? and gtc_y = ?`,
                [game.id, x, y]
            );

            // Missing health check
            if (cats.length > 1) {
                return { status: 400, result: {msg: "You cannot move the selected character there since there's already another character occupying that hex"} };
            }

            // Store the data of the first cat
            let cat = cats[0];


            let stamina = selectedCat.gtc_stamina - 1;
            await pool.query(
                `Update game_team_cat set gtc_x = ?, gtc_y = ?, gtc_stamina = ? where gtc_id = ?`,
                [x, y, stamina, catID]
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
        // Make proper neighboring checks
        return true;
    }

    // Makes all the calculation needed to end and score the game
    static async endGame(game) {
        try {
            // Both players go to score phase (id = 3)
            let sqlPlayer = `Update user_game set ug_state_id = ? where ug_id = ?`;
            await pool.query(sqlPlayer, [3, game.player.id]);
            await pool.query(sqlPlayer, [3, game.opponents[0].id]);
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