const pool = require("../../../config/database");
const Play = require("../playsInit");
require("../playsUtils");
const CatStandardAttack = require("./standardAttack");

class PopCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
        this.targetAOETeams = targetSearchTeams.concat(playerSearchTeams);
        this.validAOETargetTeams = []
    }

    generateAOETargets(targetCatData) {
        let aoeTiles = Play.getNeighborsOfRange(Play.getTile(targetCatData.x, targetCatData.y, targetCatData.boardID - 1), 1, 1);

        // Add the player team to the targetSearchTeams

        // For every team
        for (let team = 0; team < this.targetAOETeams.length; team++) {
            // Get all valid neighbors
            let targetCatIndexes = Play.getCatNeighbors(this.targetAOETeams[team].team.cats, aoeTiles);
            // If we have target
            if (targetCatIndexes.length > 0) {
                // Add a new list of targets for this team
                this.validAOETargetTeams.push({
                    // Save the database game team cat id
                    teamID:this.targetAOETeams[team].team.id,
                    // Save which team index we are looking at
                    teamIndex:team,
                    // Save all the indexes of the cats we can hit in that team
                    catIndexes:targetCatIndexes
                });
            }
        }
    }

    async attack(targetCatData, targetAOECatData) {
        let damageDealt = targetCatData.defense - this.playerCat.damage;
        console.log("Attacking Cat: " + this.playerCat.name + " GTC ID: " + this.playerCat.id);
        console.log("Attack: " + this.playerCat.damage);
        // The main cat
        console.log("Defending Cat: " + targetCatData.name + " GTC ID: " + targetCatData.id);
        console.log("Defense: " + targetCatData.defense);
        console.log("Damage Dealt: " + damageDealt);
        console.log("Updating database...");
        // Cats around the main cat
        targetAOECatData.forEach(aoeTarget => {
            let aoeDamageDealt = aoeTarget.defense - this.playerCat.damage;
            // Tally up the damage as well
            damageDealt = damageDealt + aoeDamageDealt;

            console.log("Defending Cat: " + aoeTarget.name + " GTC ID: " + aoeTarget.id);
            console.log("Defense: " + aoeTarget.defense);
            console.log("Damage Dealt: " + aoeDamageDealt);
            console.log("Updating database...");
        });

        // APPLY DAMAGE
        await Play.applyDamage(damageDealt, targetCatData.id);

        // In case we need it, give back who we hit and for how much
        return [targetCatData.id, damageDealt];
    }

    async attackRandomTarget() {
        let targetCat = this.getRandomAttackTarget();
        let targetCatData = this.targetSearchTeams[targetCat.teamIndex].team.cats[targetCat.catIndex];

        let targetHit, damageDealt;
        if (targetCatData !== null && targetCatData !== undefined) {
            // Before we attack, get our AOE targets
            this.generateAOETargets(targetCatData);
            let targetAOECatData = [];
    
            this.validAOETargetTeams.forEach(aoeTarget => {
                targetAOECatData.push(this.targetSearchTeams[aoeTarget.teamIndex].team.cats[aoeTarget.catIndex]);
            });
    
            // Standard Cat types (Melee, Ranged, Mawbreaker (Tank))
            [targetHit, damageDealt] = await this.attack(targetCatData, targetAOECatData);
        }

        // In case we need it, give back who we hit and for how much
        return targetHit, damageDealt;
    }
}

module.exports = PopCatAttack;