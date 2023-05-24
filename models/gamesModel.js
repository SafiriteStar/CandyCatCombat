const pool = require("../config/database");
const State = require("./statesModel");
const Play = require("./playsModel");

// For now it is only an auxiliary class to hold data in here 
// so no need to create a model file for it
class Player {
    constructor(id, name, state, order) {
        this.id = id;        
        this.name = name;
        this.state= state;
        this.order = order;
    }
    export() {
        let player = new Player();
        player.name = this.name;
        player.state = this.state.export();
        player.order = this.order;
        return player;
    }
}

class Game {
    constructor(id, turn, state, board, boardName, maxCost, player, opponents) {
        this.id = id;
        this.turn = turn;
        this.state = state;
        this.board = board;
        this.boardName = boardName;
        this.maxCost = maxCost;
        this.player = player;
        this.opponents = opponents || [];
    }
    export() {
        let game = new Game();
        game.id = this.id;
        game.turn = this.turn;
        game.state = this.state.export();
        if (this.player)
            game.player = this.player.export();
        game.opponents = this.opponents.map(o => o.export());
        game.board = this.board;
        game.boardName = this.boardName;
        game.maxCost = this.maxCost;
        return game;
    }

    // No verifications, we assume they were already made
    // This is mostly an auxiliary method
    static async fillPlayersOfGame(userId, game) {
        try {
            let [dbPlayers] = await pool.query(`Select * from user 
            inner join user_game on ug_user_id = usr_id
            inner join user_game_state on ugst_id = ug_state_id
            where ug_game_id=?`, [game.id]);
            for (let dbPlayer of dbPlayers) {
                let player = new Player(
                    dbPlayer.ug_id,
                    dbPlayer.usr_name,
                    new State(
                        dbPlayer.ugst_id,
                        dbPlayer.ugst_state
                    ),
                    dbPlayer.ug_order
                );
                if (dbPlayer.usr_id == userId) game.player = player;
                else game.opponents.push(player);
            }
            return {status:200, result: game};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
    
    static async getPlayerActiveGame(id) {
        try {
            let [dbGames] =
                await pool.query(`Select * from game 
                    inner join user_game on gm_id = ug_game_id 
                    inner join user_game_state on ug_state_id = ugst_id
                    inner join game_state on gm_state_id = gst_id
                    inner join board on gm_board_id = brd_id
                    where ug_user_id=? and (gst_state IN ('Waiting','Started') 
                    or (gst_state = 'Finished' and ugst_state = 'Score')) `, [id]);
            if (dbGames.length==0)
                return {status:200, result:false};
            let dbGame = dbGames[0];
            let game = new Game(dbGame.gm_id, dbGame.gm_turn, new State(dbGame.gst_id, dbGame.gst_state), dbGame.gm_board_id, dbGame.brd_name, dbGame.gm_max_cost);
            let result = await this.fillPlayersOfGame(id,game);
            if (result.status != 200) {
                return result;
            }
            game = result.result;
        return { status: 200, result: game} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getGamesWaitingForPlayers(userId) {
        try {
            let [dbGames] =
                await pool.query(`Select * from game 
                    inner join game_state on gm_state_id = gst_id
                    inner join board on gm_board_id = brd_id
                    where gst_state = 'Waiting'`);
            let games = [];
            for (let dbGame of dbGames) {
                let game = new Game(dbGame.gm_id, dbGame.gm_turn, new State(dbGame.gst_id, dbGame.gst_state), dbGame.gm_board_id, dbGame.brd_name, dbGame.gm_max_cost);
                let result = await this.fillPlayersOfGame(userId, game);
                if (result.status != 200) {
                    return result;
                }
                game = result.result;
                games.push(game);
            }
            return { status: 200, result: games} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }    

    static async #addUserToGame(userID, gameID) {
        let [result] = await pool.query('Insert into user_game (ug_user_id, ug_game_id, ug_state_id) values (?, ?, ?)',
            [userID, gameID, 1]);
        return result;
    }

    // A game is always created with one user
    // No verifications. We assume the following were already made (because of authentication):
    //  - Id exists and user exists
    //  - User does not have an active game
    static async create(userId) {
        try {
            // Get the players default team
            let [[userTeamCost]] = await pool.query(
                `Select sum(cat_cost) as "maxCost" from team_cat, cat where tmc_cat_id = cat_id and tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)`,
                    [userId]);
            
            if (userTeamCost === null || userTeamCost === undefined || userTeamCost.maxCost <= 0) {
                return { status:400, result:{ msg:"You need cats in your team!"} }
            }

            // Create the game
            let [result] = await pool.query('Insert into game (gm_state_id, gm_board_id, gm_max_cost) values (?, ?, ?)', [1, 2, userTeamCost.maxCost]);
            let gameId = result.insertId;
            // add the user to the game
            await Game.#addUserToGame(userId, gameId);

            // Get the data of the user we just made
            let [[userGame]] = await pool.query(`Select * from user_game where ug_user_id = ? and ug_game_id = ?`, [userId, gameId]);
            // Add the user's team to the game
            await Play.addDBGameCatTeam(gameId, userGame.ug_id);

            return {status:200, result: {msg: "You created a new game."}};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }


    // No verification needed since we considered that it was already made 
    // This should have a verification from every player
    // - If only one player it would cancel
    // - Else, each player would only change his state to cancel
    // - When the last player run the cancel the game would cancel
    // (no need to be this complex since we will only use this to invalidate games)
    // Cancelled games are not scored
    static async cancel(gameId) {
        try {
            await pool.query(`Update game set gm_state_id=? where gm_id = ?`,
                    [4,gameId]);
            return {status:200, result: {msg: "Game canceled."}};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // ---- These methods assume a two players game (we need it at this point) --------

    // We consider the following verifications were already made (because of authentication):
    //  - Id exists and user exists
    //  - User does not have an active game
    // We still need to check if the game exist and if it is waiting for players
    static async join(userId, gameId) {
        try {
            let [dbGames] = await pool.query(`Select * from game where gm_id=?`, [gameId]);
            if (dbGames.length==0) {
                return {status:404, result:{msg:"Game not found"}};
            }
            let dbGame = dbGames[0];

            if (dbGame.gm_state_id != 1) {
                return {status:400, result:{msg:"Game not waiting for other players"}};
            }

            let [[userTeamCost]] = await pool.query(
                `Select sum(cat_cost) as "maxCost" from team_cat, cat where tmc_enabled = true and tmc_cat_id = cat_id and tmc_team_id = (select tm_id from team where tm_user_id = ? and tm_selected = 1)`,
                [userId]);

            if (userTeamCost <= 0) {
                return {status:400, result: {msg: "You need candy cats in your team!"}};
            }
            console.log(userTeamCost.maxCost);
            console.log(dbGame.gm_max_cost);
            if (userTeamCost.maxCost > dbGame.gm_max_cost) {
                return {status:400, result: {msg: "Your team has above the maximum allowed cost!"}};
            }

            // We join the game but the game still has not started, that will be done outside
            let result = await Game.#addUserToGame(userId, gameId);

            // Get the data of the user we just made
            let [[userGame]] = await pool.query(`Select * from user_game where ug_user_id = ? and ug_game_id = ?`, [userId, gameId]);
            // Add the user's team to the game
            await Play.addDBGameCatTeam(gameId, userGame.ug_id);

            if (!teamCreation) {
                return { status:200, result: { msg: "You have no cats in your default team!" }};
            }
         
            return {status:200, result: {msg: "You joined the game."}};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

}

module.exports = Game;