const express = require('express');
const router = express.Router();
const Play = require("../models/playsModel");
const auth = require("../middleware/auth");

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

router.patch('/move', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play move");
        if (!req.characterId) {
            res.status(400).send({msg:"You cannot move character since the chosen character is not valid"});
        } else if (!req.coord) {
            res.status(400).send({msg:"You cannot move character since the chosen coordinate is not valid"});
        } else {
            let result = await Play.move(req.characterId, req.coord);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

});



module.exports = router;