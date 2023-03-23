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
            let [[playerGameTeam]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_id = ?",
                [game.id, game.player.id]
            );
            // Get the players default team
            let [playerDefaultTeam] = await pool.query(
                "select tmc_cat_id from team_cat where tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)",
                [game.player.id]
            );
            
            // Add the cats in the default team to game_team_cat
            for (let i = 0; i < playerDefaultTeam.length; i++) {
                // Get the data of the current cat
                let [[currentCat]] = await pool.query('select * from cat where cat_id = ?', [playerDefaultTeam[i].tmc_cat_id]);
                // playerDefaultTeam[i]
                // Add that cat to the game team
                await pool.query('Insert into game_team_cat (gtc_game_team_id, gtc_type_id, gtc_current_health, gtc_stamina) values (?, ?, ?, ?)',
                    [playerGameTeam.gt_id, currentCat.cat_id, currentCat.cat_max_health, currentCat.cat_speed]);
            }
            
            // Opponents (can do multiple but you should only have one)
            for (let i = 0; i < game.opponents.length; i++) {
                await pool.query(
                    'Insert into game_team (gt_game_id, gt_user_id) values (?,?)',
                    [game.id, game.opponents[i].id]);
                
                // Get the game_team id made for the player
                let [[opponentGameTeam]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_id = ?",
                    [game.id, game.opponents[i].id]
                );
                // Get the players default team
                let [opponentDefaultTeam] = await pool.query(
                    "select tmc_cat_id from team_cat where tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)",
                    [game.opponents[i].id]
                );
                
                // Add the cats in the default team to game_team_cat
                for (let j = 0; j < opponentDefaultTeam.length; j++) {
                    // Get the data of the current cat
                    let [[currentCat]] = await pool.query('select * from cat where cat_id = ?', [opponentDefaultTeam[j].tmc_cat_id]);
                    // playerDefaultTeam[i]
                    // Add that cat to the game team
                    await pool.query('Insert into game_team_cat (gtc_game_team_id, gtc_type_id, gtc_current_health, gtc_stamina) values (?, ?, ?, ?)',
                        [opponentGameTeam.gt_id, currentCat.cat_id, currentCat.cat_max_health, currentCat.cat_speed]);
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

            // The game parameter comes with the game id. So lets get the board from the game id.
            [game.board] = await pool.query('select tile_x, tile_y, tile_type_id, tile_board_id from game, tile where tile_board_id = gm_board_id and gm_id = ?',
                [game.id]);

            // Lets avoid repeated strings shall we?
            let askForCatTeam = 'select gtc_id as "id", gtc_game_team_id as "team_id", gtc_type_id as "type", gtc_x as "x", gtc_y as "y", cat_name as "name", cat_max_health as "max_health", gtc_current_health as "current_health", cat_damage as "damage", cat_defense as "defense", cat_speed as "speed", gtc_stamina as "stamina", cat_min_range as "min_range", cat_max_range as "max_range", cat_cost as "cost", gcs_state as "state" from cat, game_team_cat, game_cat_state where gtc_type_id = cat_id and gtc_state_id = gcs_id and gtc_game_team_id = ?'

            // Player info

            // Get the game_team id made for the player
            let [[playerGameTeamData]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_id = ?",
                [game.id, game.player.id]);

            // Get a list of cats in the player's game team
            [game.player.team] = await pool.query(askForCatTeam,
                [playerGameTeamData.gt_id]);

            // Opponents
            for (let i = 0; i < game.opponents.length; i++) {
                // Get the game_team id made for the opponent
                let [[opponentGameTeamData]] = await pool.query("select * from game_team where gt_game_id = ? and gt_user_id = ?",
                    [game.id, game.opponents[i].id]);

                // Get a list of cats in the opponent's game team
                [game.opponents[i].team] = await pool.query(askForCatTeam,
                    [opponentGameTeamData.gt_id]);
            }
            
            return { status: 200, result: game};
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

    static async move(game, characterId, coord) {
       try {
            let [selectedCats] = await pool.query(
                `select gtc_x, gtc_y, gtc_stamina from game_team_cat where gtc_id = ?`,
                [characterId]
            );
            selectedCats[0]
            if (selectedCats.length > 1 || selectedCats.length <= 0) {
                return { status: 400, result: {msg:"You cannot move character since the chosen character is not valid"} };
            }
            
            let selectedCat = selectedCats[0];

            if (!this.isNeighbor(selectedCat.gtc_x, selectedCat.gtc_y, coord.x, coord.y))
                return { status: 400, result: {msg:"You cannot move character since the chosen coordinate is not valid"} };

            let [[tile]] = await pool.query(
                `select * from tile where tile_x = ? and tile_y = ?`,
                [coord.x, coord.y]
            );
    
            //if tile is null
            if (!tile) 
                return { status: 400, result: {msg: "You cannot move the selected character there since it's not a tile"} };

            //if there's a wall
            if (tile.type_id == 1)  // 1 = wall
                return { status: 400, result: {msg: "You cannot move the selected character there since it's a wall"} };
    
            //if there's already a cat
            let [[cat]] = await pool.query(
                `select * from game_team_cat where gtc_x = ? and gtc_y = ?`,
                [coord.x, coord.y]
            );
            if (cat) 
                return { status: 400, result: {msg: "You cannot move the selected character there since there's already another character"} };
        
            const stamina = selectedCat.gtc_stamina - 1;
            await pool.query(
                `update game_team_cat set gtc_x = ?, gtc_y = ?, gtc_stamina = ? where gtc_id = ?`,
                [coord.x, coord.y, stamina, characterId]
            );

            return {
                status: 200, 
                result: {
                    "stamina": stamina,
                    "coord": {
                        "x": coord.x, 
                        "y": coord.y
                    }
                }     
            };
    
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static isNeighbor(fromX, fromY, toX, toY) {
        if (fromX == toX && fromY == toY - 2) return true; //middle down tile

        if (fromX == toX - 1 && fromY == toY - 1) return true; //left down diagonal tile

        if (fromX == toX - 1 && fromY == toY + 1) return true; //left tile

        if (fromX == toX && fromY == toY + 2) return true; //left up tile

        if (fromX == toX && fromY == toY + 1) return true; //middle up tile

        if (fromX == toX && fromY == toY - 1) return true; //right tile

        return false
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