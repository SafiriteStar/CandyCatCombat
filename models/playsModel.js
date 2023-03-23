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
                [game.id, p1Id]);
            
            // Get the game_team id made for the player
            let [[playerGameTeam]] = await pool.query("select gt_id from game_team where gt_game_id = ? and gt_user_id = ?",
                [game.id, game.player.id]
            );

            // Get the players default team
            let [playerDefaultTeam] = await pool.query(
                "select tmc_cat_id from team_cat where tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)",
                [game.player.id]
            );

            console.log(playerGameTeam);
            // Add the cats in the default team to game_team_cat
            for (let i = 0; i < playerDefaultTeam.length; i++) {
                // playerDefaultTeam[i]
                await pool.query('Insert into game_team_cat (gtc_game_team_id, gtc_type_id) values (?, ?)', [playerGameTeam.gt_id])
            }
            
            // // Opponents (can do multiple but you should only have one)
            // for (let i = 0; i < game.opponents.length; i++) {
            //     await pool.query(
            //         'Insert into game_team (gt_game_id, gt_user_id) values (?,?)',
            //         [game.id, game.opponents[i].id]);
            // }

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