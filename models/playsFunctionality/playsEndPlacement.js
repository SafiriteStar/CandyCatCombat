const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

Play.endPlacement = async function(game) {
    try {
        let [map1Tiles] = await pool.query(
            `Select tile_x, tile_y
            from game_team, game_team_cat, tile
            where gt_game_id = ? and gt_user_id = ? and gtc_game_team_id = gt_id and tile_x = gtc_x and tile_y = gtc_y and tile_board_id = 1`,
            [game.id, game.player.id]
        );

        // Check if there are cats to be placed
        if (map1Tiles.length > 0) {
            return { status: 400, result: {msg:"You cannot end placement since there are still cats to be placed"} };
        }

        // Change the player to be ready
        await Play.changePlayerState(2, game.player.id);

        // Check if all players are ready
        if (await Play.checkPlayersReady(game.id)) {

            // Set the player's order
            await Play.changePlayerStateByOrder(game.player.order, game.player.id);

            // For each opponent
            for (let i = 0; i < game.opponents.length; i++) {
                // Set their order
                await Play.changePlayerStateByOrder(game.opponents[i].order, game.opponents[i].id);
            }
        }

        return { status: 200, result: { msg: "You readied up." } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports = Play;