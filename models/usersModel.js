const bcrypt = require('bcrypt');
const pool = require("../config/database");
const saltRounds = 10; 

class User {
    constructor(id, name, pass, token) {
        this.id = id;
        this.name = name;
        this.pass = pass;
        this.token = token;
    }

    static async getById(id) {
        try {
            let [dbUsers] = await pool.query("Select * from user where usr_id=?", [id]);
            if (!dbUsers.length) 
                return { status: 404, result:{msg: "No user found for that id."} } ;
            let dbUser = dbUsers[0];
            return { status: 200, result: 
                new User(dbUser.id,dbUser.usr_name,dbUser.usr_pass, dbUser.usr_token)} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }  
    }

    static async register(user) {
        try {
            let [dbUsers] =
                await pool.query("Select * from user where usr_name=?", [user.name]);
            if (dbUsers.length)
                return {
                    status: 400, result: [{
                        location: "body", param: "name",
                        msg: "That name already exists"
                    }]
                };
            let encpass = await bcrypt.hash(user.pass,saltRounds);   
            // Make new user
            let [result] = await pool.query('Insert into user (usr_name, usr_pass) values (?, ?)', [user.name, encpass]);
            // Get the user ID of the newly made user
            let [[userData]] = await pool.query('Select * from user where usr_name=?', [user.name]);
            // Make a new default team for that user
            await pool.query('Insert into team (tm_user_id, tm_selected) values (?, ?)', [userData.usr_id, true]);
            // Get the team ID of the newly made team
            let [[teamData]] = await pool.query('Select * from team where tm_user_id=?', [userData.usr_id]);
            // Add characters to new default team
            let fillCharacterData = [];
            for (let i = 0; i < 6; i++) {
                [fillCharacterData[i]] = await pool.query('Insert into team_cat (tmc_cat_id, tmc_team_id) values (?, ?)', [i + 1, teamData.tm_id]);                
            }
            return { status: 200, result: {msg:"Registered! You can now log in."}} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
 

    static async checkLogin(user) {
        try {
            let [dbUsers] =
                await pool.query("Select * from user where usr_name=?", [user.name]);
            if (!dbUsers.length)
                return { status: 401, result: { msg: "Wrong username or password!"}};
            let dbUser = dbUsers[0]; 
            let isPass = await bcrypt.compare(user.pass,dbUser.usr_pass);
            if (!isPass) 
                return { status: 401, result: { msg: "Wrong username or password!"}};
            user.id = dbUser.usr_id;
            return { status: 200, result: user } ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // No verifications. Only to use internally
    static async saveToken(user) {
        try {
            let [result] =
                await pool.query(`Update user set usr_token=? where usr_id = ?`,
                [user.token,user.id]);
            return { status: 200, result: {msg:"Token saved!"}} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getUserByToken(token) {
        try {
            let [result] =
                await pool.query(`Select * from user where usr_token = ?`,[token]);
            if (!result.length)
                return { status: 403, result: {msg:"Invalid authentication!"}} ;
            let user = new User();
            user.id = result[0].usr_id;
            user.name = result[0].usr_name;
            return { status: 200, result: user} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}

module.exports = User;