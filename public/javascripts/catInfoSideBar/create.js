function createSideBar(baseCats) {
    let container = document.createElement('div');
    container.classList.add('catInfoPaginationContainer');

    let background = document.createElement('div');
    background.classList.add('catInfoPaginationBackground');
    background.onclick = () => {
        if (window.selectedCat) {
            updateCatInfoSideBar(baseCats[window.selectedCat], baseCats, "show");
        }
        else {
            updateCatInfoSideBar(baseCats[0], baseCats, "show");
        }
    }
    container.appendChild(background);

    let pagination = document.createElement('div');
    pagination.classList.add('catInfoPagination');

    for (let i = 0; i < baseCats.length; i++) {
        let item = document.createElement('button');
        item.classList.add('removeButtonStyle');
        item.classList.add('paginationItem');
        item.value = i;
        item.onclick = () => updateCatInfoSideBar(baseCats[i], baseCats, "toggle");

        let dummy = document.createElement('div');
        dummy.classList.add('squareRatioDummy');
        item.appendChild(dummy);

        let image = document.createElement('img');
        image.classList.add('containImage');
        image.src = catImagePaths[i][0];
        image.alt = 'Side Bar Cat';
        item.appendChild(image);
        
        pagination.appendChild(item);
    }

    container.appendChild(pagination);

    return container;
}

function createStatContainerWithDummy() {
    let statImageContainer = document.createElement('div');
    statImageContainer.classList.add('catInfoStatImageContainer');

    let statImageDummy = document.createElement('div');
    statImageDummy.classList.add('squareRatioDummy');
    statImageContainer.appendChild(statImageDummy);

    return statImageContainer;
}

function createStatStar(imagePath, statName) {
    let statImageContainer = createStatContainerWithDummy();

    let statImage = document.createElement('img');
    statImage.classList.add('containImage');
    statImage.src = imagePath;
    statImage.alt = statName + " Star";
    statImageContainer.appendChild(statImage);

    return statImageContainer;
}

function createSideContent() {
    let mainContainer = document.createElement('div');
    mainContainer.classList.add('catInfoContentContainer');

    let catName = document.createElement('h2');
    catName.classList.add('catInfoName');
    catName.appendChild(document.createTextNode('Cat Name'));

    mainContainer.appendChild(catName);

    let catImageContainer = document.createElement('div');
    catImageContainer.classList.add('catInfoCatImageContainer');

    let catImageDummy = document.createElement('div');
    catImageDummy.classList.add('ratioDummy4-3');
    catImageContainer.appendChild(catImageDummy);

    let catImage = document.createElement('img');
    catImage.classList.add('containImage');
    catImage.classList.add('catInfoCatImage');
    catImage.src = catImagePaths[0][0]; // Vanilla Cat By Default
    catImage.alt = 'Cat Image';
    catImageContainer.appendChild(catImage);

    mainContainer.appendChild(catImageContainer);

    let catStatsContainer = document.createElement('div');
    catStatsContainer.classList.add('catInfoStats');

    let statNames = ['Health', 'Damage', 'Defense', 'Range', 'Cost'];

    for (let i = 0; i < 5; i++) {
        let statContainer = document.createElement('div');
        statContainer.classList.add('catInfoStat');

        let textContainer = document.createElement('div');
        textContainer.classList.add('catInfoStatTextContainer');

        let statText = document.createElement('p');
        statText.classList.add('catInfoCatStatText');
        statText.classList.add('catInfoTextAdjustable');
        statText.classList.add(statNames[i].toLowerCase() + 'StatText');
        statText.appendChild(document.createTextNode(statNames[i]));
        textContainer.appendChild(statText);
        statContainer.appendChild(textContainer);

        let statVisual = document.createElement('div');
        statVisual.classList.add('catInfoStatVisual');
        statVisual.classList.add(statNames[i].toLowerCase() + 'Visual');

        let maxStars = 6;

        if (statNames[i] == 'Range') {
            let rangeHorizontalLine = document.createElement('div');
            rangeHorizontalLine.classList.add('rangeStatHorizontalLine');
            statVisual.appendChild(rangeHorizontalLine);
            maxStars = 7;
        }
        
        for (let j = 0; j < maxStars; j++) {
            let statImageContainer = createStatStar('/assets/UI/Stats/genericStat.png', statNames[i]);
            statVisual.appendChild(statImageContainer);
        }
        statContainer.appendChild(statVisual);
        catStatsContainer.appendChild(statContainer);
    }
    mainContainer.appendChild(catStatsContainer);

    let descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('catInfoDescriptionContainer');

    let catDescription = document.createElement('p');
    catDescription.classList.add('catInfoDescription');
    //catDescription.classList.add('catInfoTextAdjustable');
    catDescription.appendChild(document.createTextNode('Cat Description'));
    descriptionContainer.appendChild(catDescription);

    mainContainer.appendChild(descriptionContainer);

    return mainContainer;
}

function createCatInfoSideBar(baseCats) {

    let catInfoContainer = document.createElement('div');
    catInfoContainer.classList.add('catInfoContainer');
    //catInfoContainer.classList.add('sideInfoActive');

    catInfoContainer.appendChild(createSideBar(baseCats));
    catInfoContainer.appendChild(createSideContent());

    return catInfoContainer;
}

function createSideBarHelp(baseCats) {
    let container = document.createElement('div');
    container.classList.add('sideBarIntroButtonContainer');

    let button = document.createElement('button');
    button.classList.add('removeButtonStyle');
    button.classList.add('sideBarIntroButton');
    button.onmouseover = () => {
        let catRetainerBackImages = document.getElementsByClassName('catRetainerBackImage');
        for (let i = 0; i < catRetainerBackImages.length; i++) {
            catRetainerBackImages[i].src = '/assets/UI/Cat_Book_Button_2_Back.png'
        }

        let catRetainerImages = document.getElementsByClassName('catRetainerImage');
        for (let i = 0; i < catRetainerImages.length; i++) {
            catRetainerImages[i].src = '/assets/UI/Cat_Book_Button_2.png'
        }
    }
    button.onmouseleave = () => {
        let catRetainerBackImages = document.getElementsByClassName('catRetainerBackImage');
        for (let i = 0; i < catRetainerBackImages.length; i++) {
            catRetainerBackImages[i].src = '/assets/UI/Cat_Book_Button_1_Back.png'
        }

        let catRetainerImages = document.getElementsByClassName('catRetainerImage');
        for (let i = 0; i < catRetainerImages.length; i++) {
            catRetainerImages[i].src = '/assets/UI/Cat_Book_Button_1.png'
        }
    }
    button.onclick = () => {
        let catRetainerBackImages = document.getElementsByClassName('catRetainerBackImage');
        for (let i = 0; i < catRetainerBackImages.length; i++) {
            catRetainerBackImages[i].src = '/assets/UI/Cat_Book_Button_3_Back.png'
        }

        let catRetainerImages = document.getElementsByClassName('catRetainerImage');
        for (let i = 0; i < catRetainerImages.length; i++) {
            catRetainerImages[i].src = '/assets/UI/Cat_Book_Button_3.png'
        }

        if (window.selectedCat) {
            updateCatInfoSideBar(baseCats[window.selectedCat], baseCats, "show");
        }
        else {
            updateCatInfoSideBar(baseCats[0], baseCats, "show");
        }
    }

    let catRetainerBackImage = document.createElement('img');
    catRetainerBackImage.classList.add('containImage');
    catRetainerBackImage.classList.add('catRetainerBackImage');
    catRetainerBackImage.src = '/assets/UI/Cat_Book_Button_1_Back.png';
    button.appendChild(catRetainerBackImage);
    
    let catRetainerImage = document.createElement('img');
    catRetainerImage.classList.add('containImage');
    catRetainerImage.classList.add('catRetainerImage');
    catRetainerImage.src = '/assets/UI/Cat_Book_Button_1.png';
    button.appendChild(catRetainerImage);
    container.appendChild(button);

    let textContent = document.createElement('p');
    textContent.classList.add('sideBarIntroParagraph');
    textContent.appendChild(document.createTextNode('Ask your candy cat retainer for help!'));
    container.appendChild(textContent);

    return container;
}