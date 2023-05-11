function createElementFull(elementType, idName, classNames) {
    let element = document.createElement(elementType);
    element.id = idName;
    for (let i = 0; i < classNames.length; i++) {
        element.classList.add(classNames[i]);
    }

    return element;
}

function generateHeader() {
    let header = createElementFull('div', 'catBookletHeader', ['catBookletHeader']);
    
    let headerText = createElementFull('h2', 'catBookletHeaderText', ['catBookletHeaderText']);
    headerText.innerText = 'Candy Cats For Dummies'
    header.appendChild(headerText);

    return header;
}

function createRangeRange() {
    let rangeLine = createElementFull('div', 'rangeLine', ['rangeLine']);
    let rangeGrid = createElementFull('div', 'rangeGrid', ['rangeGrid']);
    for (let i = 0; i < 6; i++) {
        let rangeTick = createElementFull('div', 'rangeTick' + i, ['rangeTick']);
        rangeGrid.appendChild(rangeTick);
    }
    return [rangeLine, rangeGrid];
}

function createStatListItem(itemName, extraAppends) {
    let listItem = document.createElement('li');
    let statDiv = createElementFull('div', 'booklet' + itemName, ['bookletStat']);
    let statText = createElementFull('p', 'booklet' + itemName + 'Text', ['bookletStatText']);
    statText.innerText = itemName;
    let statRange = createElementFull('div', 'booklet' + itemName + 'Range', ['bookletStatRange']);
    if (extraAppends) {
        for (let i = 0; i < extraAppends.length; i++) {
            statRange.appendChild(extraAppends[i]);
        }
    }

    statDiv.appendChild(statText);
    statDiv.appendChild(statRange);
    listItem.appendChild(statDiv);

    return listItem;
}

function generateMainGrid() {
    // Main Container
    let gridContainer = createElementFull('div', 'catInfoGridContainer', ['catInfoGridContainer']);

    // Grid
    let grid = createElementFull('div', 'catInfoGrid', ['catInfoGrid']);

    // Grid Header
    let catHeader = createElementFull('div', 'catHeader', ['catHeader']);
    grid.appendChild(catHeader);
    // End Grid Header

    // Grid Cat Image
    let catImageContainer = createElementFull('div', 'catImage', ['catImage', 'catBookletCell']);
    let catImage = document.createElement('img');
    catImage.src = '/assets/UI/genericStat.png';
    catImage.alt = 'catImage';
    catImageContainer.appendChild(catImage);
    grid.appendChild(catImageContainer);
    // End Grid Cat Image

    // Grid Cat Name
    let catName = createElementFull('div', 'catName', ['catName', 'catBookletCell']);
    let catNameText = createElementFull('h2', 'catNameText', ['catNameText']);
    catName.appendChild(catNameText);
    grid.appendChild(catName);
    // End Grid Cat Name

    // Grid Cat Weapons
    let catWeapons = createElementFull('div', 'catWeapons', ['catWeapons', 'catBookletCell']);
    let weapons1 = createElementFull('img', 'weaponImage1', ['weaponImage1']);
    weapons1.src = './assets/UI/genericStat.png'
    weapons1.alt = 'weapon1';
    catWeapons.appendChild(weapons1);
    let weapons2 = createElementFull('img', 'weaponImage2', ['weaponImage2']);
    weapons2.src = './assets/UI/genericStat.png'
    weapons2.alt = 'weapon2';
    catWeapons.appendChild(weapons2);
    grid.appendChild(catWeapons);
    // End Grid Cat Weapons
    
    // Grid Cat Description
    let catDescription = createElementFull('div', 'catDescription', ['catDescription', 'catBookletCell']);
    let catDescriptionText = createElementFull('p', 'catDescriptionText', ['catDescriptionText']);
    catDescription.appendChild(catDescriptionText);
    grid.appendChild(catDescription);
    // End Grid Cat Description

    // Grid Cat Stats
    let catStats = createElementFull('div', 'catStats', ['catStats', 'catBookletCell']);
    let catStatsList = createElementFull('ul', 'catStatsList', ['catStatList']);

    catStatsList.appendChild(createStatListItem('Health', null));
    catStatsList.appendChild(createStatListItem('Damage', null));
    catStatsList.appendChild(createStatListItem('Defense', null));
    catStatsList.appendChild(createStatListItem('Range', createRangeRange()));
    catStatsList.appendChild(createStatListItem('Speed', null));
    catStatsList.appendChild(createStatListItem('Cost', null));
    catStats.appendChild(catStatsList);
    grid.appendChild(catStats);
    // End Grid Cat Stats

    // End Grid
    gridContainer.appendChild(grid);

    return gridContainer;
}

function generateCatBookletStructure() {
    // Main Container
    let catBooklet = document.getElementById('catBooklet');

    // Background Image
    let backgroundImage = createElementFull('img', 'catBookletBackgroundImage', ['catBookletBackgroundImage']);
    backgroundImage.alt = 'Booklet Background Image';
    backgroundImage.src = './assets/UI/OldPage.png';
    catBooklet.appendChild(backgroundImage);

    // Header
    catBooklet.appendChild(generateHeader());

    // Main Grid
    catBooklet.appendChild(generateMainGrid());

    return catBooklet;
}

function createArrowBooklet(arrowCharCode, value, id, baseCats) {
    let arrowButton = document.createElement("button");
    arrowButton.id = id;
    arrowButton.value = value;
    arrowButton.classList.add("arrowBooklet");
    arrowButton.classList.add("paginationLink");
    arrowButton.onclick = () => movePaginationIndex(value, baseCats);
    let arrowButtonText = document.createTextNode(arrowCharCode);
    arrowButton.appendChild(arrowButtonText);

    return arrowButton;
}

function createStatStars(baseElement, starsNumber, img) {
    for (let i = 0; i < starsNumber; i++) {
        let starImage = document.createElement('img');
        starImage.src = "/assets/UI/" + img;
        starImage.alt = "statStar"
        starImage.classList.add("statImg");
        baseElement.appendChild(starImage);
    }
}

function setCatBookletInfo(index, baseCats) {

    // Get the active page
    let paginationLinks = document.getElementsByClassName('paginationLink');
    
    // We want to skip the first and last entries since those are the arrows
    for (let i = 1; i < paginationLinks.length - 1; i++) {
        if (paginationLinks[i].classList.contains('active')) {
            if (index == i) {
                // Escape if we just clicked on the page we were already on.
                return;
            }
            paginationLinks[i].classList.remove('active');
        }
        if (index == i) {
            paginationLinks[i].classList.add('active');
        }
    }

    let cat = baseCats[index - 1];

    document.getElementById('catNameText').innerText = cat.name;
    document.getElementById('catDescriptionText').innerText = cat.description;

    // Health
    let healthRange = document.getElementById('bookletHealthRange');
    // Clear all children
    healthRange.innerHTML = '';
    let healthStars = (Math.floor(cat.health / 300) - 2);
    createStatStars(healthRange, healthStars, 'genericStat.png');

    // Damage/Healing
    let damageDisplayText = "Damage";
    let damageDisplayOffset = 0;
    if (cat.cat_id == 7) {
        damageDisplayText = "Healing";
        damageDisplayOffset = 5
    }
    else if (cat.cat_id == 2) {
        damageDisplayOffset = 1;
    }
    let damageText = document.getElementById('bookletDamageText');
    damageText.innerText = damageDisplayText;

    let damageRange = document.getElementById('bookletDamageRange');
    // Clear all children
    damageRange.innerHTML = '';
    let damageStars = ((cat.damage / 50) + damageDisplayOffset - 6);
    createStatStars(damageRange, damageStars, 'genericStat.png');
    
    // Defense
    let defenseRange = document.getElementById('bookletDefenseRange');
    defenseRange.innerHTML = '';
    let defenseStars = (cat.defense / 100);
    createStatStars(defenseRange, defenseStars, 'genericStat.png');
    
    // Range
    let [rangeRange] = document.getElementsByClassName('rangeGrid');
    //rangeRange.innerText = cat.min_range + " - " + cat.max_range;
    let rangeTicks = rangeRange.children;
    for (let i = 0; i < rangeTicks.length; i++) {
        if (i + 1 >= cat.min_range && i + 1 <= cat.max_range) {
            rangeTicks[i].classList.add('validRange');
        }
        else {
            rangeTicks[i].classList.remove('validRange');
        }
    }
    
    // Speed
    let speedRange = document.getElementById('bookletSpeedRange');
    speedRange.innerHTML = '';
    let speedStars = cat.speed;
    createStatStars(speedRange, speedStars, 'genericStat.png');
    
    // Cost
    let costRange = document.getElementById('bookletCostRange');
    costRange.innerHTML = '';
    let costStars = cat.cost;
    createStatStars(costRange, costStars, 'genericStat.png');
}

function movePaginationIndex(direction, baseCats) {
    let paginationLinks = document.getElementsByClassName('paginationLink');

    let paginationIndex = null;
    // We want to skip the first and last entries since those are the arrows
    for (let i = 1; i < paginationLinks.length - 1; i++) {
        if (paginationLinks[i].classList.contains('active')) {
            // We found the right index
            paginationIndex = i;
        }
    }

    // If we found the index
    if (paginationIndex != null) {
        // Are we still within bounds?
        if (paginationIndex + direction > 0 && paginationIndex + direction < paginationLinks.length - 1) {
            // We are
            // Move the index
            setCatBookletInfo(paginationIndex + direction, baseCats);
        }
    }
}

function createBookletPagination(baseCats) {
    let catBookletPaginationWrapper = document.createElement("div");
    catBookletPaginationWrapper.classList.add("catPaginationWrapper");
    catBookletPaginationWrapper.classList.add("catBookletCell");
    let catBookletPagination = document.createElement("div");
    catBookletPagination.classList.add("catPagination")

    catBookletPagination.appendChild(createArrowBooklet("\u21A9", -1, "leftArrowBooklet", baseCats));
    
    for (let i = 0; i < baseCats.length; i++) {
        let button = document.createElement("button");
        button.innerText = i + 1;
        button.classList.add("paginationLink");
        button.value = i;
        button.onclick = () => setCatBookletInfo(i + 1, baseCats);
        catBookletPagination.appendChild(button);
    }
    
    catBookletPagination.appendChild(createArrowBooklet("\u21AA", 1, "rightArrowBooklet", baseCats));

    catBookletPaginationWrapper.appendChild(catBookletPagination);
    
    return catBookletPaginationWrapper;
}

function createMouseOverFunctions(catBooklet) {
    // If we aren't in a game
    let p5Canvases = document.getElementsByClassName('p5Canvas');
    if (p5Canvases.length == 0) {
        // Then stop
        return
    }

    catBooklet.addEventListener("mouseleave", function (event) {
        GameInfo.isMouseOverJournal = false;
        event.target.textContext = "mouse out";
    }, false);

    catBooklet.addEventListener("mouseover", function (event) {
        GameInfo.isMouseOverJournal = true;
        event.target.textContext = "mouse in";
    }, false);
}

function createBooklet(baseCats) {
    generateCatBookletStructure();

    let catBookletGrid = document.getElementById("catInfoGrid");

    let pagination = createBookletPagination(baseCats);
    catBookletGrid.appendChild(pagination);

    // After creating the booklet, set the basic information based on which page is the active one
    setCatBookletInfo(1, baseCats);
    makeDivDraggable(document.getElementById('catBooklet'));

    // QOL for the journal when in game
    let catBooklet = document.getElementById('catBooklet');
    createMouseOverFunctions(catBooklet);

    // And the button to show the journal
    let catBookletShowButton = document.getElementById('catBookletShowButton');
    createMouseOverFunctions(catBookletShowButton);
}