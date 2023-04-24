const pool = require("../../config/database");
const Play = require("./playsInit");
const CatStandardAttack = require("./playsCatAttacks/standardAttack");
const CandyCornCatAttack = require("./playsCatAttacks/candyCornCatAttack");
const ChocoDairyMilkHeal = require("./playsCatAttacks/chocoDairyMilkHeal");
const GumCatAttack = require("./playsCatAttacks/gumCatAttack");
const CaramelCatAttack = require("./playsCatAttacks/caramelCatAttack");
const PopCatAttack = require("./playsCatAttacks/popCatAttack");

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
        let attackSuccessful = false;
        // If we aren't in the placement map and the cat is alive
        if (playerCat.boardID !== 1 && playerCat.current_health > 0) {
            let attackCat = new attackTypes[playerCat.type - 1](playerCat, opponentsTeams, [player]);

            attackSuccessful = await attackCat.executeAttackSequence();
            // Refill our stamina to max
            await Play.adjustStamina(playerCat.id, playerCat.speed - playerCat.stamina);
        }

        // Are we a stealth cat that didn't attack?
        if (playerCat.type === 4 && attackSuccessful === false) {
            // Yes
            // Do we have a ReStealth counter?
            for (let i = 0; i < playerCat.conditions.length; i++) {
                if (playerCat.conditions[i].id == 3) {
                    // We do
                    // Is it at 3?
                    if (playerCat.conditions[i].duration === 3) {
                        // Yes
                        // Remove it
                        await Play.removeCondition(playerCat.conditions[i].game_id);
                        // And add stealth
                        await Play.addCondition(playerCat.id, 1, null);
                    }
                    else {
                        // No
                        // Increase it (-1 because math)
                        await Play.tickConditionDuration(playerCat.conditions[i].game_id, -1);
                    }
                }
            }
        }
    });
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
        // Criteria to check if game ended
        if (await Play.checkEndGame(game)) {
            return await Play.endGame(game);
        } else {
            // Increase the number of turns and continue 
            await pool.query(`Update game set gm_turn = gm_turn + 1 where gm_id = ?`,
                [game.id]);
        }

        return { status: 200, result: { msg: "Your turn ended." } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}