async function refresh() {
    console.log (GameInfo.game)

    if (GameInfo.game == false) {
        window.location.reload();
    }

    if (GameInfo.game.player.state == "Waiting" || GameInfo.game.player.state == "PlacementReady") { 
        // Every time we are waiting
        await getGameInfo();
        await getBoardInfo();

        if (GameInfo.game.player.state != "Waiting" || GameInfo.game.player.state != "PlacementReady") {
            // The moment we pass from waiting to play
            GameInfo.prepareUI();
        }
    } 
    // Nothing to do when we are playing since we control all that happens 
    // so no update is needed from the server
}

function preload() {

    // Background
    GameInfo.images.backgrounds = {};
    GameInfo.images.backgrounds.arena = loadImage("../../assets/Backgrounds/ArenaBackgroundx2.png");

    // Map
    GameInfo.images.tiles = {};
    GameInfo.images.tiles.normal = loadImage("../../assets/Tiles/Floor_Tile_2_Full.png");
    GameInfo.images.tiles.wall = loadImage("../../assets/Tiles/Wall_Tile_1_Full.png");
    GameInfo.images.tiles.placement = loadImage("../../assets/Tiles/Floor_Tile_1_Full.png");
    GameInfo.images.tiles.caramel = loadImage("../../assets/Tiles/Caramel_web_4.png");

    // Cats
    GameInfo.images.cats = {};

    // Vanilla Cat
    GameInfo.images.cats.vanillaCat = {};
    GameInfo.images.cats.vanillaCat.base = loadImage("../../assets/VanillaCat/Vanilla_Cat_Base.png");
    GameInfo.images.cats.vanillaCat.fainted = loadImage("../../assets/VanillaCat/Vanilla_Cat_Base.png");
    GameInfo.images.cats.vanillaCat.attack = loadImage("../../assets/VanillaCat/Vanilla_Cat_Attack.png");
    GameInfo.images.cats.vanillaCat.weapon = loadImage("../../assets/VanillaCat/Candy_Cane_Sword.png");
    
    // Candy Corn Cat
    GameInfo.images.cats.candyCornCat = {};
    GameInfo.images.cats.candyCornCat.base = loadImage("../../assets/CandyCornCat/Candy_Corn_Cat_Base.png");
    GameInfo.images.cats.candyCornCat.fainted = loadImage("../../assets/CandyCornCat/Candy_Corn_Cat_Fainted.png");
    GameInfo.images.cats.candyCornCat.attack = loadImage("../../assets/CandyCornCat/Candy_Corn_Cat_Attack.png");
    GameInfo.images.cats.candyCornCat.weapon = loadImage("../../assets/CandyCornCat/Chocolate_and_Strawberry_Bow.png");
    
    // Mawbreaker Cat
    GameInfo.images.cats.mawbreakerCat = {};
    GameInfo.images.cats.mawbreakerCat.base = loadImage("../../assets/MawbreakerCat/Mawbreaker_Cat_Base.png");
    GameInfo.images.cats.mawbreakerCat.fainted = loadImage("../../assets/MawbreakerCat/Mawbreaker_Cat_Fainted.png");
    GameInfo.images.cats.mawbreakerCat.attack = loadImage("../../assets/MawbreakerCat/Mawbreaker_Cat_Attack.png");
    GameInfo.images.cats.mawbreakerCat.weapon = loadImage("../../assets/MawbreakerCat/Candy_Axe_NR.png");
    
    // Gum Cat
    GameInfo.images.cats.gumCat = {};
    GameInfo.images.cats.gumCat.base = loadImage("../../assets/GumCat/Gum_Cat_Base.png");
    GameInfo.images.cats.gumCat.fainted = loadImage("../../assets/GumCat/Gum_Cat_Fainted.png");
    GameInfo.images.cats.gumCat.attack = loadImage("../../assets/GumCat/Gum_Cat_Attack.png");
    GameInfo.images.cats.gumCat.weapon = loadImage("../../assets/GumCat/Daggers.png");
    GameInfo.images.cats.gumCat.stealth = loadImage("../../assets/GumCat/Gum_Cat_Steath.png");
    
    // Pop Cat
    GameInfo.images.cats.popCat = {};
    GameInfo.images.cats.popCat.base = loadImage("../../assets/PopCandyCat/Pop_Candy_Cat_Base.png");
    GameInfo.images.cats.popCat.fainted = loadImage("../../assets/PopCandyCat/Pop_Candy_Cat_Fainted.png");
    GameInfo.images.cats.popCat.attack = loadImage("../../assets/PopCandyCat/Pop_Candy_Cat_Attack.png");
    GameInfo.images.cats.popCat.weapon = loadImage("../../assets/PopCandyCat/Pop_Rocks.png");
    
    // Caramel Cat
    GameInfo.images.cats.caramelCat = {};
    GameInfo.images.cats.caramelCat.base = loadImage("../../assets/CaramelCat/Caramel_Cat_Base.png");
    GameInfo.images.cats.caramelCat.fainted = loadImage("../../assets/CaramelCat/Caramel_Cat_Fainted.png");
    GameInfo.images.cats.caramelCat.attack = loadImage("../../assets/CaramelCat/Caramel_Cat_Attack.png");
    GameInfo.images.cats.caramelCat.weapon = loadImage("../../assets/CaramelCat/Sticky_Caramel.png");
    
    // Choco Diary Milk Cat
    GameInfo.images.cats.chocoDairyMilkCat = {};
    GameInfo.images.cats.chocoDairyMilkCat.base = loadImage("../../assets/ChocoDairyMilkCat/Choco_Dairy_Milk_Cat_Base.png");
    GameInfo.images.cats.chocoDairyMilkCat.fainted = loadImage("../../assets/ChocoDairyMilkCat/Choco_Dairy_Milk_Cat_Fainted.png");
    GameInfo.images.cats.chocoDairyMilkCat.attack = loadImage("../../assets/ChocoDairyMilkCat/Choco_Dairy_Milk_Cat_Attack.png");
    GameInfo.images.cats.chocoDairyMilkCat.weapon = loadImage("../../assets/ChocoDairyMilkCat/Healing_Kit.png");
    
    // UI
    GameInfo.images.ui = {};
    GameInfo.images.ui.rooted = loadImage("../../assets/RootedIcon.png");
    GameInfo.images.ui.stealthed = loadImage("../../assets/StealthIcon.png");
}

async function resizeImages() {
    GameInfo.images.backgrounds.arena.resize(GameInfo.images.backgrounds.arena.width * 4, 0)
    GameInfo.images.tiles.normal.resize(GameInfo.images.tiles.normal.width * 2, 0);
    GameInfo.images.tiles.wall.resize(GameInfo.images.tiles.wall.width * 2, 0);
    GameInfo.images.tiles.placement.resize(GameInfo.images.tiles.placement.width * 2, 0);
    GameInfo.images.tiles.caramel.resize(GameInfo.images.tiles.caramel.width * 2, 0);
}

async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');
    canvas.mouseWheel(changeScale); // Attach listener for when the mouse wheel is over the canvas 
    // preload  images

    // Resize images
    resizeImages();
    
    await getGameInfo();
    await getBoardInfo();

    // Query takes 1 second to resolve
    function refreshQuery() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(refresh()), 1000);
        });
    }

    async function makeRefreshCall() {
        await refreshQuery();
        // After resolve it is called again 1/10th of a second later
        setTimeout(() => makeRefreshCall(), 100);
    }

    makeRefreshCall();

    //buttons (create a separated function if they are many)
    GameInfo.endturnButton = createButton('End Turn');
    GameInfo.endturnButton.parent('game');
    GameInfo.endturnButton.position(GameInfo.width - (210 + 40), GameInfo.height - (46 + 23));
    GameInfo.endturnButton.mouseClicked(endturnAction);
    GameInfo.endturnButton.addClass('game')

    GameInfo.placementReadyButton = createButton('Ready');
    GameInfo.placementReadyButton.parent('game');
    GameInfo.placementReadyButton.position(GameInfo.width - (210 + 40), GameInfo.height - (46 + 23));
    GameInfo.placementReadyButton.mouseClicked(placementReadyAction);
    GameInfo.placementReadyButton.addClass('game')

    GameInfo.prepareUI();
    

    GameInfo.loading = false;

    // Prevent right click context menu from appearing when hovering over p5
    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    
    for (let element of document.getElementsByClassName('catBooklet')) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());        
    }
    
    for (let element of document.getElementsByClassName('catBookletShowButton')) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());        
    }
}

function draw() {
    background(220);
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width/2, GameInfo.height/2);
    } else if (GameInfo.game.state == "Finished") {
        GameInfo.scoreWindow.draw();
    } else  {
        GameInfo.world.draw();
        GameInfo.scoreBoard.draw();
    }
}

async function keyPressed() {
    await GameInfo.world.keyPressed();
}

async function mousePressed() {
    GameInfo.world.mousePressed();
}

async function mouseReleased() {
    GameInfo.world.mouseReleased();
}

async function mouseClicked() {
  
}

function changeScale(event) {
    GameInfo.world.changeScale(event);
}