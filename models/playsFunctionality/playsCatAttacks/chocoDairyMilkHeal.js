const pool = require("../../../config/database");
const Play = require("../playsInit");
const CatStandardAttack = require("./standardAttack");

class ChocoDairyMilkHeal extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
        this.targetSearchTeams = this.targetSearchTeams.concat(playerSearchTeams);

        this.filters = CatStandardAttack.filters.concat(ChocoDairyMilkHeal.newFilters)
    }

    static catIsInjuredFilter(cat) {
        return cat.current_health < cat.max_health;
    }

    static newFilters = [
        ChocoDairyMilkHeal.catIsInjuredFilter
    ]

    generateAttackTargetList() {
        let attackRangeTiles = Play.getNeighborsOfRange(Play.getTile(this.playerCat.x, this.playerCat.y, this.playerCat.boardID - 1), this.playerCat.max_range, this.playerCat.min_range, true);
        
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
        let healingDealt = this.playerCat.damage;

        // If we are below half HP
        if (this.playerCat.current_health < this.playerCat.max_health * 0.5) {
            // HEAL FOR MORE
            healingDealt = healingDealt * 2;
        }

        // APPLY HEALING
        await Play.applyDamage(healingDealt, targetCatData.id);

        // If we wouldn't kill ourselves by taking damage
        if (this.playerCat.current_health - 50 > 0) {
            // Deal damage to self
            await Play.applyDamage(-50, this.playerCat.id);
        }

        // In case we need it, give back who we hit and for how much
        return [targetCatData.id, healingDealt];
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

    static async healingFervorCheck(playerCat) {
        // Do we have the healing fervor condition?
        for (let i = 0; i < playerCat.conditions.length; i++) {
            if (playerCat.conditions[i].id == 4) {
                // We do
                // Are we below half HP?
                if (playerCat.current_health < playerCat.max_health * 0.5) {
                    // We are
                    // Heal self
                    await Play.applyDamage(playerCat.damage * 0.5, playerCat.id);
                }
            }
        }
    }
}

module.exports = ChocoDairyMilkHeal;