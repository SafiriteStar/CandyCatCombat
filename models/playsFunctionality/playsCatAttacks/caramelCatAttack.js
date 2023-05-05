const pool = require("../../../config/database");
const Play = require("../playsInit");
require("../playsUtils");
const CatStandardAttack = require("./standardAttack");

class CaramelCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
    }

    async attack(targetCatData, distance) {
        let damageDealt = targetCatData.defense - this.playerCat.damage;

        // If we are in melee range
        if (distance === 0) {
            // APPLY DAMAGE
            await Play.applyDamage(damageDealt, targetCatData.id);
        }

        // Is the target already rooted?
        let isRooted = false;
        let rootedIndex = null;
        targetCatData.conditions.forEach(function(condition, index) {
            if (condition.name == "Rooted") {
                // Yes it is
                isRooted = true;
                rootedIndex = index;
            }
        });

        // So if the target is rooted
        if (isRooted) {
            // Reset the duration
            Play.setConditionDuration(targetCatData.conditions[rootedIndex].id, 1);
        }
        else {
            // Since its not rooted
            // Add the condition (2 is rooted)
            Play.addCondition(targetCatData.id, 2, 1);
        }

        return [targetCatData.id, damageDealt];
    }

    async attackRandomTarget() {
        let targetCat = this.getRandomAttackTarget();

        let targetHit, damageDealt;
        if (targetCat !== null && targetCat !== undefined) {
            [targetHit, damageDealt] = await this.attack(this.targetSearchTeams[targetCat.teamIndex].team.cats[targetCat.catIndex], targetCat.distance);
        }

        // In case we need it, give back who we hit and for how much
        return targetHit !== null && targetHit !== undefined;
    }
}

module.exports = CaramelCatAttack;