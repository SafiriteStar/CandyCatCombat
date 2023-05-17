window.onload = async function() {
    try {
        let result = await checkGame(true);
        document.getElementById('player').textContent = "Hello " + window.game.player.name;
        if (result.err) throw result.err;
    } catch (err) {
        console.log(err);
       // alert("Something went wrong!")
    }
}

function waitingQuery() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(checkGameStarted(), 1000));
    });
}

async function makeWaitingCall() {
    await waitingQuery();
    setTimeout(() => makeWaitingCall(), 100);
}

makeWaitingCall();

async function checkGameStarted() {
    try {
        await checkGame(true);
    } catch(err) {
        console.log(err);
    }
}

async function cancel() {
    try {
        let result = await requestCancelMatch();
        if (result.successful)
            window.location.pathname = "matches.html"
        else alert("Something wrong. Not able to cancel.")
    } catch(err) {
        console.log(err);
    }
}

function setTeamCatImages(team) {
    let catImagePaths = [
        ['./assets/VanillaCat/Peppermint_Shield.png', './assets/VanillaCat/Vanilla_Cat_Base.png', './assets/VanillaCat/Candy_Cane_Sword.png'],
        ['./assets/CandyCornCat/Candy_Corn_Cat_Base.png', './assets/CandyCornCat/Chocolate_and_Strawberry_Bow.png'],
        ['./assets/MawbreakerCat/Mawbreaker_Cat_Base.png', './assets/MawbreakerCat/Candy_Axe_NR.png'],
        ['./assets/GumCat/Gum_Cat_Base.png', './assets/GumCat/Daggers.png'],
        ['./assets/PopCandyCat/Pop_Candy_Cat_Base.png', './assets/PopCandyCat/Pop_Rocks.png'],
        ['./assets/CaramelCat/Caramel_Cat_Base.png', './assets/CaramelCat/Sticky_Caramel.png'],
        ['./assets/ChocoDairyMilkCat/Choco_Dairy_Milk_Cat_Base.png', './assets/ChocoDairyMilkCat/Healing_Kit.png'],
    ];
    // For each cat we have, set their images on the page
    let catMaxIndex = 0;
    for (let i = 0; i < team.length; i++) {
        let catDiv = document.getElementById("waitingCat" + (i + 1));
        if (catDiv !== null && catDiv !== undefined) {
            catDiv.innerHTML = '';

            for (let j = 0; j < catImagePaths[team[i].type - 1].length; j++) {
                let catImage = document.createElement('img');
                catImage.src = catImagePaths[team[i].type - 1][j];
                catDiv.appendChild(catImage);
            }
    
    
            catDiv.style.visibility = 'visible';
            catMaxIndex = i + 1;
        }
    }
    // For the rest of the images, make them invisible
    for (; catMaxIndex < 6; catMaxIndex++) {
        let catDiv = document.getElementById("waitingCat" + catMaxIndex + 1);
        
        if (catDiv !== null && catDiv !== undefined) {
            catDiv.innerHTML = '';
            catDiv.style.visibility = 'hidden';
        }
    }
}