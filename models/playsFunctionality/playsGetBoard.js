const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

Play.getBoard = async function(game) {
    try {
        // Get a copy of the world
        let world = Play.worldData;

        // Player info
        world.player = await Play.getGameCatTeam("player", game.player.id, game.id);
        world.player.state = game.player.state;

        // Opponents
        world.opponents = [];

        // If we are in a state that we are allowed to see our opponents
        if (game.player.state.name == "Playing" || game.player.state.name == "Waiting" || game.player.state.name == "Score" || game.player.state.name == "End") {
            for (let i = 0; i < game.opponents.length; i++) {
                world.opponents[i] = await Play.getGameCatTeam("opponent" + game.opponents[i].id, game.opponents[i].id, game.id);
                world.opponents[i].state = game.opponents[i].state;
            }
        }
        
        return { status: 200, result: world};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}