const pool = require("../../config/database");
const Play = require("./playsInit");
require("./playsUtils");

Play.checkEndGame = async function(game) {
    // Have we reached our turn limit?
    if (game.turn >= Play.maxNumberTurns) {
        // Yes, end the game
        return true;
    }
    
    // Check if any of the teams are dead
    let playerCatCount = await Play.countLiveCats(game.player.id, game.id);
    let opponentCatCount = await Play.countLiveCats(game.opponents[0].id, game.id);
    
    // If either of them are 0, just end the game
    if (playerCatCount === 0 || opponentCatCount === 0) {
        return true;
    }

    console.log(playerCatCount);
    console.log(opponentCatCount);
    
    // If we got here, the game can continue
    console.log("Keep the game going");
    return false;
}

// Makes all the calculation needed to end and score the game
Play.endGame = async function(game) {
    try {
        // Both players go to score phase (id = 5)
        let sqlPlayer = `Update user_game set ug_state_id = ? where ug_id = ?`;
        await pool.query(sqlPlayer, [5, game.player.id]);
        await pool.query(sqlPlayer, [5, game.opponents[0].id]);
        // Set game to finished (id = 3)
        await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [3, game.id]);

        // Insert score lines with the state and points.
        // A player has a score equal to the number of dead cats on the enemy team
        let sqlScore = `Insert into scoreboard (sb_user_game_id, sb_state_id, sb_points) values (?, ?, ?)`;
        let playerScore = await Play.countDeadCats(game.opponents[0].id, game.id);
        let opponentScore = await Play.countDeadCats(game.player.id, game.id);
        await pool.query(sqlScore, [game.player.id, 1, playerScore]);
        await pool.query(sqlScore, [game.opponents[0].id, 1, opponentScore]);

        return { status: 200, result: { msg: "Game ended. Check scores." } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}