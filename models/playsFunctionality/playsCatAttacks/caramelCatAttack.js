const pool = require("../../../config/database");
const Play = require("../playsInit");
require("../playsUtils");
const CatStandardAttack = require("./standardAttack");

class CaramelCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
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
            Play.setConditionDuration(targetCatData.conditions[rootedIndex].id, 2);
        }
        else {
            // Since its not rooted
            // Add the condition (2 is rooted)
            Play.addCondition(targetCatData.id, 2, 2);
        }

        return [targetCatData.id, damageDealt];
    }
}

module.exports = CaramelCatAttack;