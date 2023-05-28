// All the variables for the game UI
// we only have one game info so everything is static
class GameInfo  {
    // settings variables
    static width = (window.innerWidth * (1 - (0.04 * 0.9)));
    static height = window.innerHeight;

    static loading = true;

    // data
    static game;
    static images = {};
    static sounds = {};
    static isMouseOverMenu = false;

    // rendererers
    static scoreBoard;
    static scoreWindow;
    static board;
    static world;
    static placementBoard;
    static cat;

    // buttons
    static endturnButton;
    static placementReadyButton;

    static showTurnModal(text) {
        // Change the text
        let modalTexts = document.getElementsByClassName('modal-text');
        for (let i = 0; i < modalTexts.length; i++) {
            modalTexts[i].innerHTML = text;            
        }

        // Show the modal
        let turnModals = document.getElementsByClassName('modal-game');
        for (let i = 0; i < turnModals.length; i++) {
            turnModals[i].classList.add('modal-show');
        }
    }

    // Write your UI settings for each game state here
    // Call the method every time there is a game state change
    static prepareUI() {
        if (GameInfo.game.player.state == "Placement") {
            GameInfo.showTurnModal("Place Your Cats");
            if (GameInfo.world.teams[0].unplacedCatsCheck()) {
                GameInfo.placementReadyButton.hide();
            }
            else {
                GameInfo.placementReadyButton.show();
            }
            GameInfo.endturnButton.hide();
        }
        else if (GameInfo.game.player.state == "PlacementReady") {
            GameInfo.showTurnModal("Readied Up");
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
        }
        else if (GameInfo.game.player.state == "Waiting") {
            GameInfo.showTurnModal("Opponent's Turn");
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
        }
        else if (GameInfo.game.player.state == "Playing") {
            GameInfo.showTurnModal("Your Turn");
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.show();
        }
        else if (GameInfo.game.player.state == "Score") {
            GameInfo.showTurnModal("Match Over");
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
            let scoreContainers = document.getElementsByClassName('scoreContainer');
            for (let i = 0; i < scoreContainers.length; i++) {
                scoreContainers[i].classList.remove('scoreSwitch');
            }
        }
        else if (GameInfo.game.player.state == "End") {
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
        }
    }
}