const pool = require("../../../config/database");
const Play = require("../playsInit");

class CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        this.playerCat = playerCat;
        this.targetSearchTeams = targetSearchTeams;
        this.validTargetTeams = [];
        this.playerSearchTeams;
        this.filters = CatStandardAttack.filters;
    }

    static catIsAliveFilter(cat) {
        return cat.current_health > 0;
    }

    static filters = [
        CatStandardAttack.catIsAliveFilter
    ]

    generateAttackTargetList() {
        let attackRangeTiles = Play.getNeighborsOfRange(Play.getTile(this.playerCat.x, this.playerCat.y, this.playerCat.boardID - 1), this.playerCat.max_range, this.playerCat.min_range);
        
        // Reset our list
        this.validTargetTeams = [];

        // For every team
        for (let team = 0; team < this.targetSearchTeams.length; team++) {
            // Get all valid neighbors
            let targetCatIndexes = Play.getCatNeighbors(this.targetSearchTeams[team].team.cats, attackRangeTiles, this.filters);
            // If we have target
            if (targetCatIndexes.length > 0) {
                // Add a new list of targets for this team
                this.validTargetTeams.push({
                    // Save the database game team cat id
                    teamID:this.targetSearchTeams[team].team.id,
                    // Save which team index we are looking at
                    teamIndex:team,
                    // Save all the indexes of the cats we can hit in that team
                    catIndexes:targetCatIndexes
                });
            }
        }
    }

    async attack(targetCatData) {
        let damageDealt = targetCatData.defense - this.playerCat.damage;
        console.log("Attacking Cat: " + this.playerCat.name + " GTC ID: " + this.playerCat.id);
        console.log("Attack: " + this.playerCat.damage);
        console.log("Defending Cat: " + targetCatData.name + " GTC ID: " + targetCatData.id);
        console.log("Defense: " + targetCatData.defense);
        console.log("Damage Dealt: " + damageDealt);
        console.log("Updating database...");

        // APPLY DAMAGE
        await Play.applyDamage(damageDealt, targetCatData.id);

        // In case we need it, give back who we hit and for how much
        return [targetCatData.id, damageDealt];
    }

    getRandomAttackTarget() {
        // Array of arrays that holds: teamIndex and CatIndex
        let closestCats = [];
        let shortestDistance = Infinity;
        
        let targetCat; // Return cat
        
        // For each team
        this.validTargetTeams.forEach(team => {
            // Go through all available cats
            team.catIndexes.forEach(cat => {
                // Is this cat closer or equal distance than our current one?
                if (cat.distance <= shortestDistance) {
                    // Is it shorter
                    if (cat.distance < shortestDistance) {
                        // Set a new shortest distance
                        shortestDistance = cat.distance;
                        // Override the current array
                        closestCats = [];
                    }
                    // Add a new cat in
                    closestCats.push({teamIndex: team.teamIndex, catIndex:cat.index, distance:cat.distance});
                }
            });
        });

        // If we have more than one cat
        if (closestCats.length > 1) {
            // Randomly choose one
            targetCat = closestCats[Math.floor(Math.random() * closestCats.length)];
        }
        else {
            // We only have one cat so save that
            targetCat = closestCats[0];
        }

        return targetCat;
    }

    async attackRandomTarget() {
        let targetCat = this.getRandomAttackTarget();
        // Standard Cat types (Melee, Ranged, Mawbreaker (Tank))
        let targetHit, damageDealt;
        if (targetCat !== null && targetCat !== undefined) {
            [targetHit, damageDealt] = await this.attack(this.targetSearchTeams[targetCat.teamIndex].team.cats[targetCat.catIndex]);
        }

        // In case we need it, give back who we hit and for how much
        return targetHit, damageDealt;
    }

    async executeAttackSequence() {
        // Get the cats we can attack
        this.generateAttackTargetList();
        // Attack a random target
        await this.attackRandomTarget();
    }

    setNewSearchTeam(targetSearchTeams) {
        this.targetSearchTeams = targetSearchTeams;
        this.validTargetTeams = [];
    }

}

module.exports = CatStandardAttack;