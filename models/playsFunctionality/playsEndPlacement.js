const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

Play.endPlacement = async function(game) {
    try {
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