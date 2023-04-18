    const pool = require("../../config/database");
    const Play = require("../playsFunctionality/playsInit");

    Play.move = async function(game, x, y, map, catID, teamID) {
        try {
                // let [userGames] = await pool.query(
                //     `Select *
                //     from user_game
                //     where ug_user_id = ? and ug_game_id = ?`,
                //     [user, game]
                // );

                // // Check if user with that ID is playing this game
                // if (userGames.length > 1) {
                //     return { status: 400, result: {msg:"You cannot move the character since the user is not playing this game"} };
                // }

                // // Get the user_game data
                // let userGame = userGames[0];

                // // Check if it's the user's turn
                // if (userGame.ug_state_id === 3) {
                //     return { status: 400, result: {msg:"You cannot move the character since it's not this user's turn"} };
                // }

            let [selectedCats] = await pool.query(
                `Select *
                from game_team_cat
                where gtc_id = ?`,
                [catID]
            );

            // Check if any cats with those ID's exist
            if (selectedCats.length > 1) {
                return { status: 400, result: {msg:"You cannot move the character since the chosen character is not valid"} };
            }

            // Get the cat that was returned
            let selectedCat = selectedCats[0];

            // Dead cats can't be moved
            if (selectedCat.gtc_state_id === 3) {
                return { status: 400, result: {msg:"You cannot move the character since it is dead"} };
            }

            // Ask for the tile data at the coordinates
            let [tiles] = await pool.query(
                `Select *
                from tile
                where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                [x, y, map]
            );

            // Does the tile exist?
            if (tile === 0) {
                return { status: 400, result: {msg: "You cannot move the selected character there since it's not a tile"} };
            }

            // Store the data
            let tile = tiles[0]

            if (selectedCat.gtc_game_board_id === 1) {
                if (tile.tile_type_id != 3) {
                    return { status: 400, result: {msg: "You cannot move the selected character there since it's not a valid position"} };
                }

                await pool.query(
                    `Update game_team_cat set gtc_game_board_id = 2 where gtc_id = ?`,
                    [catID]
                );
            }
            else {
                if (selectedCat.gtc_game_board_id !== 2) {
                    return { status: 400, result: {msg:"You cannot move the character since the chosen coordinate is not valid"} };
                }
                // Is the target tile not next to the cat?
                if (!this.isNeighbor(selectedCat.gtc_x, selectedCat.gtc_y, x, y)) {
                    return { status: 400, result: {msg:"You cannot move the character since the chosen coordinate is not valid"} };
                }
            }

            // Is the tile a wall?
            if (tile.type_id == 2) { // 2 = wall
                return { status: 400, result: {msg: "You cannot move the selected character there since it's a wall"} };
            }

            // Is there a cat already at the target tile?
            let [cats] = await pool.query(
                `Select gtc_x, gtc_y
                from game, game_team, game_team_cat
                where gtc_x = ? and gtc_y = ? and gtc_game_board_id = ? and gt_id = ?`,
                [x, y, map, teamID]
            );

            // TODO: Add an above "0" health check
            if (cats.length > 1 && map !== 1) {
                return { status: 400, result: {msg: "You cannot move the selected character there since there's already another character occupying that hex"} };
            }

            // Update the cat info
            let stamina = selectedCat.gtc_stamina - 1;
            await pool.query(
                `Update game_team_cat set gtc_x = ?, gtc_y = ?, gtc_game_board_id = ?, gtc_stamina = ? where gtc_id = ?`,
                [x, y, map, stamina, catID]
            );

            return {
                status: 200, 
                result: {
                    "stamina": stamina,
                    "x": x,
                    "y": y
                }     
            };

        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }



    Play.isNeighbor = function(originX, originY, targetX, targetY) {
        // Make proper neighboring checks
        return true;
    }