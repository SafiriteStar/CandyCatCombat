const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

// Load in a team for the player or opponents using their default teams
Play.addDBGameCatTeam = async function(gameId, playerId) {

    // Add in a new game team
    await pool.query(
        'Insert into game_team (gt_game_id, gt_user_game_id) values (?, ?)',
        [gameId, playerId]);
    
    // Get the game_team ID made for the player
    let [[playerGameTeam]] = await pool.query("Select * from game_team where gt_game_id = ? and gt_user_game_id = ?",
        [gameId, playerId]
    );

    // Get the player's user id
    let [[userData]] = await pool.query(`Select ug_user_id as "id" from user_game where ug_id = ?`, [playerId]);

    // Get the players default team
    let [playerDefaultTeam] = await pool.query(
        "Select tmc_cat_id from team_cat where tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)",
        [userData.id]
    );
    
    // Add the cats in the default team to game_team_cat
    for (let i = 0; i < playerDefaultTeam.length; i++) {
        // Get the data of the current cat
        let [[currentCat]] = await pool.query('Select * from cat where cat_id = ?', [playerDefaultTeam[i].tmc_cat_id + 1]);

        // Add that cat to the game team, default to the placement board (1)
        await pool.query(
            `Insert into game_team_cat (
                gtc_game_team_id,
                gtc_type_id,
                gtc_current_health,
                gtc_stamina,
                gtc_x,
                gtc_y,
                gtc_game_board_id
            )
            values (?, ?, ?, ?, ?, ?, ?)`,
                [
                    playerGameTeam.gt_id,       // gtc_game_team_id
                    currentCat.cat_id,          // gtc_type_id
                    currentCat.cat_max_health,  // gtc_current_health
                    currentCat.cat_speed,       // gtc_stamina
                    i,                          // gtc_x
                    0,                          // gtc_y
                    1                           // gtc_game_board_id
                ]);
    }

    // After adding all the cats, add in any special conditions
    
    // Get the cat data:
    let playerTeamData = await Play.getGameCatTeam("Player", playerId, gameId);
    console.log(playerTeamData);
    // For every cat in the player team
    playerTeamData.team.cats.forEach(async function(cat) {
        // If its a gum at
        if (cat.type === 4) {
            // Add in the stealth condition (condition id: 1)
            await pool.query(
                `Insert into game_team_cat_condition (gcc_gtc_id, gcc_ccn_id) values (?, ?)`,
                    [cat.id, 1]);
        }
    });
}

Play.startGame = async function(game) {
    try {
        // Randomly determines who starts    
        let myTurn = (Math.random() < 0.5);
        let p1Id = myTurn ? game.player.id : game.opponents[0].id;
        let p2Id = myTurn ? game.opponents[0].id : game.player.id;

        // Player
        await Play.addDBGameCatTeam(game.id, game.player.id);
        
        // Opponents (can do multiple but you should only have one)
        for (let i = 0; i < game.opponents.length; i++) {
            await Play.addDBGameCatTeam(game.id, game.opponents[i].id);
        }

        // Player that start changes to order 1 
        await pool.query(`Update user_game set ug_order=? where ug_id = ?`, [1, p1Id]);
        // Player that is second changes to order 2
        await pool.query(`Update user_game set ug_order=? where ug_id = ?`, [2, p2Id]);

        // Changing the game state to start
        await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [2, game.id]);

    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}