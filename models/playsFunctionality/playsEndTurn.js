const pool = require("../../config/database");
const Play = require("./playsInit");
require("./playsAttacks");
const CatStandardAttack = require("./playsCatAttacks/standardAttack");

const ChocoDairyMilkHeal = require("./playsCatAttacks/chocoDairyMilkHeal");
const GumCatAttack = require("./playsCatAttacks/gumCatAttack");
const CaramelCatAttack = require("./playsCatAttacks/caramelCatAttack");
const PopCatAttack = require("./playsCatAttacks/popCatAttack");
const CandyCornCatAttack = require("./playsCatAttacks/candyCornCatAttack");
let attackTypes = [
    CatStandardAttack, // Vanilla Cat
    CandyCornCatAttack, // Candy Corn Cat
    CatStandardAttack, // Mawbreaker Cat
    GumCatAttack, // Gum Cat
    PopCatAttack, // Pop Cat
    CaramelCatAttack, // Caramel Cat
    ChocoDairyMilkHeal // Choco Diary Milk Cat
]

Play.resolveAttacks = async function(game) {
    // Get the player team
    let player = await Play.getGameCatTeam("player", game.player.id, game.id);

    // Get the opponents team
    let opponentsTeams = [];
    for (let i = 0; i < game.opponents.length; i++) {
        opponentsTeams[i] = await Play.getGameCatTeam("opponent", game.opponents[i].id, game.id);
    }
    // For every player cat
    player.team.cats.forEach(async function(playerCat, index, array) {
        // If we aren't in the placement map
        if (playerCat.boardID !== 1) {

            let attackCat = new attackTypes[playerCat.type](playerCat, opponentsTeams, [player]);

            await attackCat.executeAttackSequence();
        }
    });
}

// auxiliary function to check if the game ended
async function checkEndGame(game) {
    return game.turn >= Play.maxNumberTurns;
}

// This considers that only one player plays at each moment,
// so ending my turn starts the other players turn
// We consider the following verifications were already made:
// - The user is authenticated
// - The user has a game running
// NOTE: This might be the place to check for victory, but it depends on the game
Play.endTurn = async function(game) {
    try {
        // Resolve attacks (if any)
        await Play.resolveAttacks(game);

        // Change player state to waiting (3)
        await Play.changePlayerState(3, game.player.id);
        await Play.changePlayerState(4, game.opponents[0].id);

        // Both players played
        if (game.player.order == 4) {
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