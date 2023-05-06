const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

Play.getMap = async function() {
    try {
        // No checks need to be made as you can receive world data whenever you want!
        return {status: 200, result: Play.getWorld()};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

Play.getGameTeams = async function(game) {
    try {
        // Player info
        let player = await Play.getGameCatTeam("player", game.player.id, game.id);
        player.state = game.player.state;

        // Opponents
        let opponents = [];

        // If we are in a state that we are allowed to see our opponents
        if (game.player.state.name == "Playing" || game.player.state.name == "Waiting" || game.player.state.name == "Score" || game.player.state.name == "End") {
            for (let i = 0; i < game.opponents.length; i++) {
                opponents[i] = await Play.getGameCatTeam("opponent" + game.opponents[i].id, game.opponents[i].id, game.id);
                opponents[i].state = game.opponents[i].state;
            }
        }
        
        return { status: 200, result: { player: player, opponents: opponents } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}