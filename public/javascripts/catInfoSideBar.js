function createSideBar(baseCats) {
    let container = document.createElement('div');
    container.classList.add('catInfoPaginationContainer');

    let background = document.createElement('div');
    background.classList.add('catInfoPaginationBackground');
    container.appendChild(background);

    let pagination = document.createElement('div');
    pagination.classList.add('catInfoPagination');

    for (let i = 0; i < baseCats.length; i++) {
        let item = document.createElement('button');
        item.classList.add('removeButtonStyle');
        item.classList.add('paginationItem');
        item.value = i;
        item.onclick = () => updateCatInfoSideBar(baseCats[i], baseCats);

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
            let statImageContainer = createStatStar('../assets/UI/genericStat.png', statNames[i]);
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
    catDescription.classList.add('catInfoTextAdjustable');
    catDescription.appendChild(document.createTextNode('Cat Description'));
    descriptionContainer.appendChild(catDescription);

    mainContainer.appendChild(descriptionContainer);

    return mainContainer;
}

function calculateStatRanges(baseCats) {
    let statNames = ['health', 'damage', 'defense'];
    let statRanges = {};

    for (let i = 0; i < statNames.length; i++) {
        if (statNames[i] == 'range') {
            continue;
        }
        
        let statMin = Infinity;
        let statMax = 0;

        for (let j = 0; j < baseCats.length; j++) {
            if (baseCats[j].cat_id == 7 && statNames[i] == 'damage') {
                statRanges['healing'] = {min:baseCats[j].damage * 0.5, max:baseCats[j].damage * 2};
            }
            else if (baseCats[j][statNames[i]] > statMax) {
                statMax = baseCats[j][statNames[i]];
            }
            else if (baseCats[j][statNames[i]] < statMin) {
                statMin = baseCats[j][statNames[i]];
            }
        }

        statRanges[statNames[i]] = ({min:statMin, max:statMax});
    }

    window.statRanges = statRanges;
}

function createCatInfoSideBar(baseCats) {

    let catInfoContainer = document.createElement('div');
    catInfoContainer.classList.add('catInfoContainer');
    //catInfoContainer.classList.add('sideInfoActive');

    catInfoContainer.appendChild(createSideBar(baseCats));
    catInfoContainer.appendChild(createSideContent());

    return catInfoContainer;
}

function calculateStars(key, value) {
    let min = window.statRanges[key].min;
    let max = window.statRanges[key].max;

    let maxStars = 6;
    let minStars = 1;
    if (key == 'defense') {
        maxStars = 3;
    }
    else if (key == 'healing') {
        minStars = 3;
    }

    return Math.min(Math.max(Math.ceil(((value - min) / (max - min)) * maxStars), minStars), maxStars);
}

function updateCatInfoSideBar(cat, baseCats, show) {
    // If we clicked on the cat we are already on
    if (window.selectedCat == cat.cat_id - 1) {
        toggleCatInfoSideBar();
        return;
    }
    if (show === true || show === false) {
        toggleCatInfoSideBar(show);
    }
    else {
        toggleCatInfoSideBar(true);
    }
    window.selectedCat = cat.cat_id - 1;
    
    let paginationButtons = document.getElementsByClassName('paginationItem');

    for (let i = 0; i < paginationButtons.length; i++) {
        if (paginationButtons[i].value == cat.cat_id - 1) {
            paginationButtons[i].classList.add('activePaginationItem');
        }
        else {
            paginationButtons[i].classList.remove('activePaginationItem');
        }
    }

    let catNames = document.getElementsByClassName('catInfoName');

    for (let i = 0; i < catNames.length; i++) {
        catNames[i].innerHTML = cat.name;
    }

    let catImages = document.getElementsByClassName('catInfoCatImage');

    for (let i = 0; i < catImages.length; i++) {
        catImages[i].src = catImagePaths[cat.cat_id - 1][0];
    }

    let stats = ['health', 'damage', 'defense'];
    let statsImage = ['../assets/UI/healthStat.png', '../assets/UI/damageStat.png', '../assets/UI/defenseStat.png'];

    for (let i = 0; i < stats.length; i++) {

        if (stats[i] == 'damage') {
            let damageTexts = document.getElementsByClassName('damageStatText');
            for (let j = 0; j < damageTexts.length; j++) {
                if (cat.cat_id == 7) {
                    damageTexts[j].innerHTML = '';
                    damageTexts[j].appendChild(document.createTextNode('Healing'));
                }
                else {
                    damageTexts[j].innerHTML = '';
                    damageTexts[j].appendChild(document.createTextNode('Damage'));
                }
                
            }
        }

        let statVisuals = document.getElementsByClassName(stats[i] + 'Visual');
        
        for (let j = 0; j < statVisuals.length; j++) {
            statVisuals[j].innerHTML = '';
            // Calculate how many stars to show

            let statSearch = (stats[i] == 'damage' && cat.cat_id == 7) && 'healing' || stats[i];
            let statImagePath = (stats[i] == 'damage' && cat.cat_id == 7) && '../assets/UI/healingStat.png' || statsImage[i];
            let starNum = calculateStars(statSearch, cat[stats[i]]);
            for (let k = 0; k < starNum; k++) {
                let statStar = createStatStar(statImagePath, statSearch);
                statVisuals[j].appendChild(statStar);
            }
        }
    }

    let rangeStatVisuals = document.getElementsByClassName('rangeVisual');
        
    for (let j = 0; j < rangeStatVisuals.length; j++) {
        rangeStatVisuals[j].innerHTML = '';
        let horizontalLine = document.createElement('div');
        horizontalLine.classList.add('rangeStatHorizontalLine');
        rangeStatVisuals[j].appendChild(horizontalLine);

        // Calculate how many stars to show

        let catRangeImage = createStatStar(catImagePaths[cat.cat_id - 1][0], 'Range Cat');
        catRangeImage.style.transform = 'scaleX(-1)';
        rangeStatVisuals[j].appendChild(catRangeImage);

        for (let i = 0; i < 6; i++) {
            if (i + 1 >= cat.min_range && i + 1 <= cat.max_range) {
                let statStar = createStatStar('../assets/UI/genericStat.png', 'Range Tick');
                rangeStatVisuals[j].appendChild(statStar);
            }
            else {
                let statImageContainer = createStatContainerWithDummy();

                let statImage = document.createElement('div');
                statImage.classList.add('rangeStatVerticalLine');
                statImageContainer.appendChild(statImage);
                rangeStatVisuals[j].appendChild(statImageContainer);
            }
        }
    }

    let costStatVisuals = document.getElementsByClassName('costVisual');
        
    for (let i = 0; i < costStatVisuals.length; i++) {
        costStatVisuals[i].innerHTML = '';
        // Calculate how many stars to show

        for (let j = 0; j < cat.cost; j++) {
            let statStar = createStatStar('../assets/UI/genericStat.png', 'Cost');
            costStatVisuals[i].appendChild(statStar);
        }
    }

    let catDescriptions = document.getElementsByClassName('catInfoDescription');

    for (let i = 0; i < catDescriptions.length; i++) {
        catDescriptions[i].innerHTML = '';
        catDescriptions[i].appendChild(document.createTextNode(cat.description));
    }
}

function toggleCatInfoSideBar(show) {
    let sideBars = document.getElementsByClassName('catInfoContainer')
    for (let i = 0; i < sideBars.length; i++) {
        if (show === true && !sideBars[i].classList.contains('sideInfoActive')) {
            sideBars[i].classList.add('sideInfoActive');
        }
        else if (show === false && sideBars[i].classList.contains('sideInfoActive')) {
            sideBars[i].classList.remove('sideInfoActive');
        }
        else if (show === null || show === undefined) {
            sideBars[i].classList.toggle('sideInfoActive');
        }
    }
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
            catRetainerBackImages[i].src = '../assets/UI/Cat_Book_Button_2_Back.png'
        }

        let catRetainerImages = document.getElementsByClassName('catRetainerImage');
        for (let i = 0; i < catRetainerImages.length; i++) {
            catRetainerImages[i].src = '../assets/UI/Cat_Book_Button_2.png'
        }
    }
    button.onmouseleave = () => {
        let catRetainerBackImages = document.getElementsByClassName('catRetainerBackImage');
        for (let i = 0; i < catRetainerBackImages.length; i++) {
            catRetainerBackImages[i].src = '../assets/UI/Cat_Book_Button_1_Back.png'
        }

        let catRetainerImages = document.getElementsByClassName('catRetainerImage');
        for (let i = 0; i < catRetainerImages.length; i++) {
            catRetainerImages[i].src = '../assets/UI/Cat_Book_Button_1.png'
        }
    }
    button.onclick = () => {
        let catRetainerBackImages = document.getElementsByClassName('catRetainerBackImage');
        for (let i = 0; i < catRetainerBackImages.length; i++) {
            catRetainerBackImages[i].src = '../assets/UI/Cat_Book_Button_3_Back.png'
        }

        let catRetainerImages = document.getElementsByClassName('catRetainerImage');
        for (let i = 0; i < catRetainerImages.length; i++) {
            catRetainerImages[i].src = '../assets/UI/Cat_Book_Button_3.png'
        }

        updateCatInfoSideBar(baseCats[0], baseCats, true);
    }

    let catRetainerBackImage = document.createElement('img');
    catRetainerBackImage.classList.add('containImage');
    catRetainerBackImage.classList.add('catRetainerBackImage');
    catRetainerBackImage.src = '../assets/UI/Cat_Book_Button_1_Back.png';
    button.appendChild(catRetainerBackImage);
    
    let catRetainerImage = document.createElement('img');
    catRetainerImage.classList.add('containImage');
    catRetainerImage.classList.add('catRetainerImage');
    catRetainerImage.src = '../assets/UI/Cat_Book_Button_1.png';
    button.appendChild(catRetainerImage);
    container.appendChild(button);

    let textContent = document.createElement('p');
    textContent.classList.add('sideBarIntroParagraph');
    textContent.appendChild(document.createTextNode('Ask your candy cat retainer for help!'));
    container.appendChild(textContent);

    return container;
}