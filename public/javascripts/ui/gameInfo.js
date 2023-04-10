// All the variables for the game UI
// we only have one game info so everything is static
class GameInfo  {
    // settings variables
    static width = 1200;
    static height = 600;

    static loading = true;

    // data
    static game;
    static images = {};
    static sounds = {};

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

    // Write your UI settings for each game state here
    // Call the method every time there is a game state change
    static prepareUI() {
        if (GameInfo.game.player.state == "Placement") {
            GameInfo.placementReadyButton.show();
            GameInfo.endturnButton.hide();
        }
        else if (GameInfo.game.player.state == "PlacementReady") {
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
        }
        else if (GameInfo.game.player.state == "Waiting") {
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
        }
        else if (GameInfo.game.player.state == "Playing") { 
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.show();
        }
        else if (GameInfo.game.player.state == "Score") {
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
            GameInfo.scoreWindow.open();
        }
        else if (GameInfo.game.player.state == "End") {
            GameInfo.placementReadyButton.hide();
            GameInfo.endturnButton.hide();
        }
    }
}