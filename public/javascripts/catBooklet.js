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

function createBooklet(baseCats) {
    let catBooklet = document.getElementById("catInfoGridContainer");

    let pagination = createBookletPagination(baseCats);
    catBooklet.appendChild(pagination);

    // After creating the booklet, set the basic information based on which page is the active one
    setCatBookletInfo(1, baseCats);
}