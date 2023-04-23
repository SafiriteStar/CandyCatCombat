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
            let targetCatIndexes = Play.getCatNeighbors(this.targetAOETeams[team].team.cats, aoeTiles, this.filters);
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
        // Need to to this here because javascript is weird...
        let playerCatData = this.playerCat;
        
        let damageDealt = targetCatData.defense - playerCatData.damage;
        console.log("Attacking Cat: " + playerCatData.name + " GTC ID: " + playerCatData.id);
        console.log("Attack: " + playerCatData.damage);
        // The main cat
        console.log("Defending Cat: " + targetCatData.name + " GTC ID: " + targetCatData.id);
        console.log("Defense: " + targetCatData.defense);
        console.log("Damage Dealt: " + damageDealt);
        console.log("Updating database...");
        await Play.applyDamage(damageDealt, targetCatData.id);
        
        // Cats around the main cat
        targetAOECatData.forEach(async function(aoeTarget) {
            console.log("AOE TARGET: ");
            console.log(aoeTarget);
            let aoeDamageDealt = aoeTarget.defense - playerCatData.damage;
            // Tally up the damage as well
            damageDealt = damageDealt + aoeDamageDealt;
            
            console.log("Defending Cat: " + aoeTarget.name + " GTC ID: " + aoeTarget.id);
            console.log("Defense: " + aoeTarget.defense);
            console.log("Damage Dealt: " + aoeDamageDealt);
            console.log("Updating database...");
            await Play.applyDamage(aoeDamageDealt, aoeTarget.id);
        });

        // APPLY DAMAGE

        // In case we need it, give back who we hit and for how much
        return [targetCatData.id, damageDealt];
    }

    async attackRandomTarget() {
        let targetCat = this.getRandomAttackTarget();
        
        let targetHit, damageDealt;
        if (targetCat !== null && targetCat !== undefined) {
            // Before we attack, get our AOE targets
            this.generateAOETargets(this.targetSearchTeams[targetCat.teamIndex].team.cats[targetCat.catIndex]);
            let targetAOECatData = [];
    
            this.validAOETargetTeams.forEach(team => {
                team.catIndexes.forEach(aoeTarget => {
                    targetAOECatData.push(this.targetSearchTeams[team.teamIndex].team.cats[aoeTarget.index]);
                });
            });
            console.log(targetAOECatData);
            // Standard Cat types (Melee, Ranged, Mawbreaker (Tank))
            [targetHit, damageDealt] = await this.attack(this.targetSearchTeams[targetCat.teamIndex].team.cats[targetCat.catIndex], targetAOECatData);
        }

        // In case we need it, give back who we hit and for how much
        return targetHit, damageDealt;
    }
}

module.exports = PopCatAttack;