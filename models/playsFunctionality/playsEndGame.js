const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

// Makes all the calculation needed to end and score the game
Play.endGame = async function(game) {
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