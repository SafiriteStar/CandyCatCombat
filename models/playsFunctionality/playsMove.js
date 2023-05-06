const pool = require("../../config/database");
const Play = require("../playsFunctionality/playsInit");

async function moveToTile(game, x, y, map, catID, teamID) {
    try {
        // Check if it's the user's turn
        if (!(game.player.state.id === 1 || game.player.state.id === 4)) { // If its not the placement (1) or playing (4) phase, we can't move

            return { status: 400, result: {msg:"You cannot move the character since it's not this user's turn"} };
        }
        
        let [selectedCats] = await pool.query(
            `Select *
            from game_team_cat
            where gtc_id = ?`,
            [catID]
        );

        // Check if any cats with that ID exists
        if (selectedCats.length > 1) {
            return { status: 400, result: {msg:"You cannot move the character since the chosen character is not valid"} };
        }

        // Get the cat that was returned
        let selectedCat = selectedCats[0];
        let stamina = selectedCat.gtc_stamina;

        let [selectedCatConditions] = await pool.query(
            `Select gcc_ccn_id as "id" from game_team_cat_condition where gcc_gtc_id = ?`, [selectedCat.gtc_id])

        // Dead cats can't be moved
        if (selectedCat.gtc_state_id === 3) { // 3 = dead
            return { status: 400, result: {msg:"You cannot move the character since it is dead"} };
        }

        // Check if the cat is rooted
        // For every condition the cat has
        for (let i = 0; i < selectedCatConditions.length; i++) {
            // If its rooted
            if (selectedCatConditions[i].id === 2) {
                // Don't move
                return { status: 400, result: { msg:"You cannot move the character since it is rooted" } };
            }
        }

        // Cats with no stamina can't be moved
        if (stamina <= 0) {
            return { status: 400, result: {msg:"You cannot move the character since it has no stamina"} };
        }

        // Ask for the tile data at the coordinates
        let [tiles] = await pool.query(
            `Select *
            from tile
            where tile_x = ? and tile_y = ? and tile_board_id = ?`,
            [x, y, map]
        );

        // Does the tile exist?
        if (tiles.length === 0) {
            return { status: 400, result: {msg: "You cannot move the selected character there since it's not a tile"} };
        }

        // Store the data
        let tile = tiles[0]

        // Is the tile a wall?
        if (tile.tile_type_id == 2) { // 2 = wall
            return { status: 400, result: {msg: "You cannot move the selected character there since it's a wall"} };
        }

        // Is there a cat already at the target tile?
        let [cats] = await pool.query(
            `Select *
            from game, game_team, game_team_cat
            where gtc_x = ? and gtc_y = ? and gtc_game_board_id = ? and gt_game_id = ? and gtc_game_team_id = gt_id and gm_id = gt_game_id`,
            [x, y, map, game.id]
        );

        if (cats.length > 1) {
            for (let i = 0; i < cats.length; i++) {
                // Is the cat in the tile alive
                if (cats[i].gtc_current_health > 0) {
                    return { status: 400, result: {msg: "You cannot move the selected character there since there's already another character occupying that hex"} };
                }
            }
        }

        // Check if moving cat from board 1
        if (selectedCat.gtc_game_board_id === 1) {

            // Check if it's not placement tile
            if (tile.tile_type_id !== 3) {
                return { status: 400, result: {msg: "You cannot move the selected character there since it's not a valid position"} };
            }

            // Check if valid placement group
            let [tileGroups] = await pool.query(
                `Select *
                from placement_tile_group
                where ptg_tile_x = ? and ptg_tile_y = ? and ptg_tile_board_id = ?`,
                [x, y, map]
            );

            // Does the tile group exist?
            if (tileGroups.length === 0) {
                return { status: 400, result: {msg: "You cannot move the selected character there since it's not a valid tile"} };
            }

            let tileGroup = tileGroups[0];
            if(tileGroup.ptg_group !== game.player.order && tileGroup.ptg_group !== 0) {
                return { status: 400, result: {msg: "You cannot move the selected character there since it's not a valid placement group"} };
            }

            // Change cat to board2
            await pool.query(
                `Update game_team_cat set gtc_game_board_id = 2 where gtc_id = ?`,
                [catID]
            );
        }
        // Moving from board 2
        else {
            // Check if player is in placement state
            if (game.player.state.id === 1) { // 1 = Placement
                if (tile.tile_type_id !== 3) { // 3 = Placement tile
                    return { status: 400, result: {msg:"You cannot end placement since you readied up"} };
                }
                // Check if valid placement group
                let [tileGroups] = await pool.query(
                    `Select *
                    from placement_tile_group
                    where ptg_tile_x = ? and ptg_tile_y = ? and ptg_tile_board_id = ?`,
                    [x, y, map]
                );

                // Does the tile group exist?
                if (tileGroups.length === 0) {
                    return { status: 400, result: {msg: "You cannot move the selected character there since it's not a valid tile"} };
                }

                let tileGroup = tileGroups[0];
                if(tileGroup.ptg_group !== game.player.order && tileGroup.ptg_group !== 0) {
                    return { status: 400, result: {msg: "You cannot move the selected character there since it's not a valid placement group"} };
                }

            } 
            else if (game.player.state.id === 4) {

                // Check if the target tile not in same board or not next to the cat
                if (selectedCat.gtc_game_board_id !== tile.tile_board_id || !Play.isNeighbor(selectedCat.gtc_x, selectedCat.gtc_y, x, y)) {
                    return { status: 400, result: {msg:"You cannot move the character since the chosen coordinate is not valid"} };
                }

                // Use stamina
                stamina = stamina - 1;
 
            }
        }

        // Update the cat info
        await pool.query(
            `Update game_team_cat set gtc_x = ?, gtc_y = ?, gtc_game_board_id = ?, gtc_stamina = ? where gtc_id = ?`,
            [x, y, map, stamina, catID]
        );

        return {
            status: 200, 
            result: {
                stamina: stamina,
                x: x,
                y: y
            }
        };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

Play.move = async function(game, path, catID, teamID) {
    try {
        for (let i = 0; i < path.length; i++) {
            result = await moveToTile(game, path[i].x, path[i].y, path[i].map, catID, teamID);
            if (result.status !== 200) {
                break;
            }
        }

        return result;
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}



Play.isNeighbor = function(originX, originY, targetX, targetY) {

    if (originX == targetX && originY == targetY + 1) { // middle up tile
        return true;
    }

    if (originX == targetX && originY == targetY - 1) { // middle down tile
        return true;
    }

    if (originX == targetX - 1 && originY == targetY) { // left tile
        return true;
    }

    if (originX == targetX + 1 && originY == targetY) { // right tile
        return true;
    }

    // If the originX is an even number
    if (originX % 2 === 0 && originY === targetY - 1) { // right up tile
        if (originX === targetX + 1) {
            return true;
        }

        if (originX === targetX - 1) { // left up tile
            return true;
        }
    }

    // If the originX is an odd number
    else if(Math.abs(originX % 2) === 1 && originY === targetY + 1) { // right down tile
        if (originX === targetX + 1) {
            return true;
        }

        if (originX === targetX - 1) { // left down tile
            return true;
        }
    }

    return false;
}