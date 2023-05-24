function createPlayerRow(playerName, scorePercentage, cats) {
    let row = document.createElement('div');
    row.classList.add('scoreRow');
    row.classList.add('rowContent');

    // Name
    let nameColumn = document.createElement('div');
    nameColumn.classList.add('scoreColumn');
    nameColumn.classList.add('text');
    nameColumn.classList.add('content');

    if (playerName !== null) {
        nameColumn.innerText = playerName;
    }
    else {
        nameColumn.innerText = 'Player Name';
    }

    row.appendChild(nameColumn);

    // Score Percentage
    let scoreColumn = document.createElement('div');
    scoreColumn.classList.add('scoreColumn');
    scoreColumn.classList.add('text');
    scoreColumn.classList.add('content');

    if (scorePercentage !== null) {
        scoreColumn.innerText = scorePercentage;
    }
    else {
        scoreColumn.innerText = 'Score';
    }

    row.appendChild(scoreColumn);

    // Team
    let catColumn = document.createElement('div');
    catColumn.classList.add('scoreColumn');
    catColumn.classList.add('cats');

    let scoreCats = document.createElement('div');
    scoreCats.classList.add('scoreCats');
    
    let scoreCatsLength = cats && cats.length || 6
    for (let i = 0; i < scoreCatsLength; i++) {
        let scoreCat = document.createElement('img');

        if (cats) {
            let catImagePaths = [
                ['./assets/VanillaCat/Vanilla_Cat_Base.png', './assets/VanillaCat/Vanilla_Cat_Fainted.png'],
                ['./assets/CandyCornCat/Candy_Corn_Cat_Base.png', './assets/CandyCornCat/Candy_Corn_Cat_Fainted.png'],
                ['./assets/MawbreakerCat/Mawbreaker_Cat_Base.png', './assets/MawbreakerCat/Mawbreaker_Cat_Fainted.png'],
                ['./assets/GumCat/Gum_Cat_Base.png', './assets/GumCat/Gum_Cat_Fainted.png'],
                ['./assets/PopCandyCat/Pop_Candy_Cat_Base.png', './assets/PopCandyCat/Pop_Candy_Cat_Fainted.png'],
                ['./assets/CaramelCat/Caramel_Cat_Base.png', './assets/CaramelCat/Caramel_Cat_Fainted.png'],
                ['./assets/ChocoDairyMilkCat/Choco_Dairy_Milk_Cat_Base.png', './assets/ChocoDairyMilkCat/Choco_Dairy_Milk_Cat_Fainted.png']
            ]
            
            if (cats[i].fainted) {
                scoreCat.src = catImagePaths[cats[i].id - 1][1];
            }
            else {
                scoreCat.src = catImagePaths[cats[i].id - 1][0];
            }
        }
        else {
            scoreCat.src = '/assets/UI/Stats/genericStat.png';
        }
        scoreCats.appendChild(scoreCat);
    }

    catColumn.appendChild(scoreCats);
    row.appendChild(catColumn);

    return row;
}

function getPlayerTeam(name, teams) {
    let cats = [];
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].playerName == name) {
            for (let j = 0; j < teams[i].cats.length; j++) {
                cats.push({ id:teams[i].cats[j].type, fainted: !(teams[i].cats[j].current_health > 0)});
            }
        }
    }

    return cats;
}

function getScoreData(name, scoresArray, teams) {
    for (let i = 0; i < scoresArray.length; i++) {
        if (scoresArray[i].name == name) {
            let cats = getPlayerTeam(name, teams);
            return {name:scoresArray[i].name, points:(scoresArray[i].points * 100), state:scoresArray[i].state, cats:cats};
        }
    }
}

async function formatPlayerScores(scoresArray, playerData, opponentsData, teams) {
    console.log(scoresArray);
    let playerScoreList = [];
    let playerScoreData = getScoreData(playerData.name, scoresArray, teams);
    playerScoreList.push(playerScoreData);

    for (let i = 0; i < opponentsData.length; i++) {
        playerScoreList.push(getScoreData(opponentsData[i].name, scoresArray, teams));
    }

    updateScoreContent(playerScoreData.state, playerScoreList);
}

function updateScoreContent(endState, players) {
    let scoreStateTexts = document.getElementsByClassName('scoreStateText');
    for (let i = 0; i < scoreStateTexts.length; i++) {
        if (endState == "Won") {
            scoreStateTexts[i].innerText = 'Victory';
        }
        else if (endState == "Lost") {
            scoreStateTexts[i].innerText = 'Defeat';
        }
        else if (endState == "Tied") {
            scoreStateTexts[i].innerText = 'Tie';
        }
        else {
            scoreStateTexts[i].innerText = 'What happened?';
        }
    }

    // Get all existing content
    let rowContents = document.getElementsByClassName('rowContent');

    // And then remove
    while (rowContents.length > 0) {
        rowContents[0].remove();
    }

    // Get the score table
    let scoreContents = document.getElementsByClassName('scoreContent');

    for (let i = 0; i < scoreContents.length; i++) {
        for (let j = 0; j < players.length; j++) {
            let contentRow = createPlayerRow(players[j].name, players[j].points, players[j].cats);
            scoreContents[i].appendChild(contentRow);
        }
    }
}

function createScoreScreen() {
    let main = document.getElementById('game');

    let scoreContainer = document.createElement('div');
    scoreContainer.classList.add('scoreContainer');
    scoreContainer.classList.add('scoreSwitch');

    let scoreFrameImage = document.createElement('img');
    scoreFrameImage.classList.add('scoreFrameImage');
    scoreFrameImage.src = "../assets/UI/FrameWithContent.png";
    scoreFrameImage.alt = "Score Frame Image";
    scoreContainer.appendChild(scoreFrameImage);

    let scoreFrame = document.createElement('div');
    scoreFrame.classList.add('scoreFrame');

    let scoreStateText = document.createElement('h1');
    scoreStateText.classList.add('scoreStateText');
    scoreStateText.innerText = 'GAME END CONDITION';
    scoreFrame.appendChild(scoreStateText);

    let scoreContent = document.createElement('div');
    scoreContent.classList.add('scoreContent');

    // Header Row
    let scoreRowHeader = document.createElement('div');
    scoreRowHeader.classList.add('scoreRow');
    scoreRowHeader.classList.add('rowHeader');

    let headerInnerText = ['Player', 'Score', 'Team'];
    let headerRowClasses = ['text', 'text', 'cats'];

    for (let i = 0; i < headerInnerText.length; i++) {
        let scoreColumn = document.createElement('div');
        scoreColumn.classList.add('scoreColumn');
        scoreColumn.classList.add(headerRowClasses[i]);
        scoreColumn.classList.add('header');
        scoreColumn.innerText = headerInnerText[i];
        scoreRowHeader.appendChild(scoreColumn);
    }

    scoreContent.appendChild(scoreRowHeader);

    for (let i = 0; i < 2; i++) {
        let contentRow = createPlayerRow(null, null, null);
        scoreContent.appendChild(contentRow);
    }

    scoreFrame.appendChild(scoreContent);
    scoreContainer.appendChild(scoreFrame);

    // Close Score Button
    let scoreCloseButton = document.createElement('div');
    scoreCloseButton.classList.add('scoreCloseButton');
    scoreCloseButton.onclick = closeScore;

    let scoreCloseButtonImage = document.createElement('img');
    scoreCloseButtonImage.classList.add('scoreCloseButtonImage');
    scoreCloseButtonImage.src = './assets/UI/LongerButton.png';
    scoreCloseButtonImage.alt = 'Close Score Button';
    scoreCloseButton.appendChild(scoreCloseButtonImage);

    let scoreCloseButtonText = document.createElement('p');
    scoreCloseButtonText.classList.add('scoreCloseButtonText');
    scoreCloseButtonText.innerText = 'Close Score';
    scoreCloseButton.appendChild(scoreCloseButtonText);

    scoreContainer.appendChild(scoreCloseButton);

    main.appendChild(scoreContainer);
}