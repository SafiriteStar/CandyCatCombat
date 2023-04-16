const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

// Assumes we have at least 1 team to attack
// With at least 1 cat in each team
Play.attackTargets = async function(attackCatData, opponents, targetTeams) {
    // Get a random team
    let targetTeam = Math.floor(Math.random() * targetTeams.length);

    // Get a random cat in that team
    let targetCat = targetTeams[targetTeam].catIndexes[Math.floor(Math.random() * targetTeams[targetTeam].catIndexes.length)];

    let targetCatData = opponents[targetTeams[targetTeam].teamIndex].team.cats[targetCat]

    let damageDealt = targetCatData.defense - attackCatData.damage;
    console.log("Attacking Cat: " + attackCatData.name + " GTC ID: " + attackCatData.id);
    console.log("Attack: " + attackCatData.damage);
    console.log("Defending Cat: " + targetCatData.name + " GTC ID: " + targetCatData.id);
    console.log("Defense: " + targetCatData.defense);
    console.log("Damage Dealt: " + damageDealt);
}

Play.generateAttackList = async function(playerCat, opponentsTeams) {
    let attackRangeTiles = Play.getNeighborsOfRange(Play.getTile(playerCat.x, playerCat.y, playerCat.boardID - 1), playerCat.max_range, playerCat.min_range);

    // The list of teams we will attack with this cat
    let targetTeams = [];
        
    // For every opponent team
    for (let team = 0; team < opponentsTeams.length; team++) {
        // Get all valid neighbors
        let targetCatIndexes = Play.getCatNeighbors(opponentsTeams[team].team.cats, attackRangeTiles);
        // If we have target
        if (targetCatIndexes.length > 0) {
            // Add a new list of targets for this team
            targetTeams.push({
                // Save the database id
                teamID:opponentsTeams[team].team.id,
                // Save which team index we are looking at
                teamIndex:team,
                // Save all the indexes of the cats we can hit in that team
                catIndexes:targetCatIndexes
            });
        }
    }

    // After looking at every opponent team for who we can attack
    // Do we have targets to attack?
    if (targetTeams.length > 0) {
        // Yes
        // Attack those cats
        await Play.attackTargets(playerCat, opponentsTeams, targetTeams);
    }
}

Play.resolveAttacks = async function(game) {
    // Get the player team
    let player = await Play.getGameCatTeam("player", game.player.id, game.id);

    // Get the opponents team
    let opponentsTeams = [];
    for (let i = 0; i < game.opponents.length; i++) {
        opponentsTeams[i] = await Play.getGameCatTeam("opponent", game.opponents[i].id, game.id);
    }
    // For every player cat
    player.team.cats.forEach(playerCat => {
        // If we aren't in the placement map
        if (playerCat.boardID !== 1) {
            Play.generateAttackList(playerCat, opponentsTeams);
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