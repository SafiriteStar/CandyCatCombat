function createTeamCatOption(position, cat, teamCost, teamId) {
    let optionContainer = document.createElement('div');
    optionContainer.classList.add('dt-catOption');
    optionContainer.classList.add('dt-catOptionType' + cat.cat_id);
    optionContainer.classList.add(position[0]);
    optionContainer.classList.add(position[1]);
    optionContainer.setAttribute('onmouseenter', `updateCatInfoIndex(${cat.cat_id - 1})`);
    optionContainer.setAttribute('onclick', `changeDefaultCat(${cat.cat_id}, ${teamId}, this)`);

    let inner = document.createElement('div');
    inner.classList.add('dt-catOptionInner');

    let front = document.createElement('div');
    front.classList.add('dt-catOptionFront');
    inner.appendChild(front);

    let back = document.createElement('div');
    back.classList.add('dt-catOptionBack');

    let catImage = document.createElement('img');
    catImage.classList.add('catType' + cat.cat_id);
    catImage.classList.add('containImage');
    catImage.classList.add('center');
    catImage.classList.add('dt-optionCatImage');
    if (teamCost - 1 + cat.cost > 6) {
        catImage.classList.add('dt-unavailableOption');
    }
    catImage.src = catImagePaths[cat.cat_id - 1][0];
    catImage.alt = "Cat Option";
    back.appendChild(catImage);

    let costContainer = document.createElement('div');
    costContainer.classList.add('dt-costContainer');

    
    for (let i = 0; i < cat.cost; i++) {
        let coinContainer = document.createElement('div');
        coinContainer.classList.add('dt-coinContainer');

        let costImage = document.createElement('img');
        costImage.classList.add('containImage');
        costImage.classList.add('center');
        costImage.src = "/assets/UI/costStat.png";
        costImage.alt = "Cost Coin";
        coinContainer.appendChild(costImage);
        costContainer.appendChild(coinContainer);
    }

    back.appendChild(costContainer);
    inner.appendChild(back);
    optionContainer.appendChild(inner);

    return optionContainer;
}

function createTeamCatOverlay(baseCats, team, teamId) {
    let overlay = document.createElement('div');
    overlay.classList.add('dt-catOverlay');

    let optionPositions = [
        ["dt-optionRow1", "dt-optionColumn3"],
        ["dt-optionRow2", "dt-optionColumn4"],
        ["dt-optionRow3", "dt-optionColumn5"],
        ["dt-optionRow4", "dt-optionColumn4"],
        ["dt-optionRow5", "dt-optionColumn3"],
        ["dt-optionRow4", "dt-optionColumn2"],
        ["dt-optionRow3", "dt-optionColumn1"],
        ["dt-optionRow2", "dt-optionColumn2"]
    ]
    let index = 0;

    let teamCost = calculateTeamCost(team, baseCats);

    for (; index < baseCats.length; index++) {
        let option = createTeamCatOption(optionPositions[index], baseCats[index], teamCost, teamId);
        overlay.appendChild(option);
    }

    // Create the remove cat option
    let removeOption = document.createElement('div');
    removeOption.classList.add('dt-catOption');
    removeOption.classList.add(optionPositions[index][0]);
    removeOption.classList.add(optionPositions[index][1]);
    removeOption.onclick = () => removeDefaultCat(teamId);    

    let removeInner = document.createElement('div');
    removeInner.classList.add('dt-catOptionInner');
    
    let removeFront = document.createElement('div');
    removeFront.classList.add('dt-catOptionFront');
    removeInner.appendChild(removeFront);
    
    let removeBack = document.createElement('div');
    removeBack.classList.add('dt-catOptionBack');
    
    let removeImage = document.createElement('img');
    removeImage.classList.add('containImage');
    removeImage.classList.add('center');
    removeImage.classList.add('dt-optionCatImage');
    removeImage.src = "/assets/UI/CrossOption.png";
    removeImage.alt = "Remove Cat";

    removeBack.appendChild(removeImage);

    removeInner.appendChild(removeBack);
    removeOption.appendChild(removeInner);
    overlay.appendChild(removeOption);

    return overlay;
}

function createTeamCat(position, cat, team, baseCats) {
    let catContainer = document.createElement('div');
    catContainer.id = "teamCat" + cat.id;
    catContainer.classList.add('dt-catContainer');
    catContainer.classList.add(position[0]);
    catContainer.classList.add(position[1]);
    catContainer.setAttribute('onmouseenter', `showCatOverlay(this, ${cat.cat_id - 1})`);
    catContainer.setAttribute('onmouseleave', `removeAllCatOverlays()`);


    let dummy = document.createElement('div');
    dummy.classList.add('squareRatioDummy');
    catContainer.appendChild(dummy);

    let selectedCatContainer = document.createElement('div');
    selectedCatContainer.classList.add('dt-selectedCat');

    let selectedCatImage = document.createElement('img');
    selectedCatImage.id = 'selectedCatImage' + cat.id;
    selectedCatImage.classList.add('containImage');
    selectedCatImage.classList.add('center');
    selectedCatImage.classList.add('dt-selectedCatImage');
    if (cat.enabled == 0) {
        selectedCatImage.src = "/assets/UI/AddOption.png";
    }
    else {
        selectedCatImage.src = catImagePaths[cat.cat_id -1][0];
    }
    selectedCatImage.alt = "Selected Cat";
    selectedCatContainer.appendChild(selectedCatImage);
    catContainer.appendChild(selectedCatContainer);

    let catOverlay = createTeamCatOverlay(baseCats, team, cat.id);
    catContainer.appendChild(catOverlay);

    return catContainer;
}

function createDefaultTeamDisplay(team, baseCats) {
    let mainContainer = document.createElement('div');
    mainContainer.classList.add('dt-teamContainer');

    let dummy = document.createElement('div');
    dummy.classList.add('squareRatioDummy');
    mainContainer.appendChild(dummy);

    let teamCostContainer = document.createElement('div');
    teamCostContainer.classList.add('dt-teamCostContainer')
    teamCostContainer.classList.add('center');

    let teamCostText = document.createElement('p');
    teamCostText.appendChild(document.createTextNode(calculateTeamCost(team, baseCats)));
    teamCostText.classList.add('dt-teamCostText');
    teamCostContainer.appendChild(teamCostText);
    mainContainer.appendChild(teamCostContainer);

    let catPositions = [
        ["dt-catCircleRow1", "dt-catCircleColumn2"],
        ["dt-catCircleRow1", "dt-catCircleColumn3"],
        ["dt-catCircleRow2", "dt-catCircleColumn1"],
        ["dt-catCircleRow2", "dt-catCircleColumn4"],
        ["dt-catCircleRow3", "dt-catCircleColumn2"],
        ["dt-catCircleRow3", "dt-catCircleColumn3"]
    ]

    for (let i = 0; i < team.length; i++) {
        let teamCat = createTeamCat(catPositions[i], team[i], team, baseCats);
        mainContainer.appendChild(teamCat);
    }

    return mainContainer;
}