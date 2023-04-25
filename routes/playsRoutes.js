const express = require('express');
const router = express.Router();
const World = require('../db_scripts/mapPopulate');
const Play = require("../models/playsModel");
const auth = require("../middleware/auth");
require("../db_scripts/mapPopulate");

router.get('/auth', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Get information about the game");
        if (!req.game) {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        }
        else {
            let result = await Play.getBoard(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(result.status).send(result.result);
    }
});

router.patch('/endturn', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play End Turn");
        if (!req.game) {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        } else if (req.game.player.state.name != "Playing") {
            // Do not need to check if there are two players since in that case
            // the player will not be on Playing state
            res.status(400).send({msg: 
                "You cannot end turn since you are not currently on your turn"});
        } else {
            let result = await Play.endTurn(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch('/placementready', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play Placement Ready");
        if (!req.game) {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        } else if (req.game.player.state.name != "Placement") {
            // Do not need to check if there are two players since in that case
            // the player will not be on Playing state
            res.status(400).send({msg: 
                "You cannot ready since you are not currently in placement mode"});
        } else {
            let result = await Play.endPlacement(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch('/move', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play move");

        if (req.body.catID === null || req.body.catID < 0) {
            res.status(400).send({msg:"You cannot move character since the chosen character is not valid"});
        } else if ((req.body.x === null || req.body.y === null) && (req.body.placementX === null || req.body.placementY === null)) {
            res.status(400).send({msg:"You cannot move character since the chosen coordinate is not valid"});
        } else {
            let result = await Play.move(req.game, req.body.x, req.body.y, req.body.placementX, req.body.placementY, req.body.catID, req.body.teamID);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


// Generates and sets the map
router.get('/generateMap', async function(req, res, next) {
    try {
        console.log("Generating Map");
        await Play.setWorldData(World.createWorld, true, true);
        res.status(200).send({ msg: "Map Generated!" });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;