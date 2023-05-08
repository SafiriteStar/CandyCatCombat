function createArrowBooklet(arrowCharCode, value, id) {
    let arrowButton = document.createElement("button");
    arrowButton.id = id;
    arrowButton.value = value;
    arrowButton.classList.add("arrowBooklet");
    arrowButton.classList.add("paginationLink");
    let arrowButtonText = document.createTextNode(arrowCharCode);
    arrowButton.appendChild(arrowButtonText);

    return arrowButton;
}

function setCatBookletInfo(index, baseCats) {

    let cat = baseCats[index - 1];

    document.getElementById('catName').innerHTML = cat.name;
    document.getElementById('catDescription').innerHTML = cat.description;

    let statsContainer = document.getElementById('catStats');

    // Health
    let healthContainer = document.getElementById('bookletHealth');
    healthContainer.innerText = "Heath: " + (Math.floor(cat.health / 300) - 2);

    // Damage/Healing
    let damageText = "Damage";
    let damageDisplayOffset = 0;
    if (cat.cat_id == 7) {
        damageText = "Healing";
        damageDisplayOffset = 5
    }
    else if (cat.cat_id == 2) {
        damageDisplayOffset = 1;
    }
    let damageContainer = document.getElementById('bookletDamage');
    damageContainer.innerText = damageText + ": " + ((cat.damage / 50) + damageDisplayOffset - 6);

    // Defense
    let defenseContainer = document.getElementById('bookletDefense');
    defenseContainer.innerText = "Defense: " + (cat.defense / 100);

    // Range
    let rangeContainer = document.getElementById('bookletRange');
    rangeContainer.innerText = "Range: " + cat.min_range + " - " + cat.max_range;

    // Speed
    let speedContainer = document.getElementById('bookletSpeed');
    speedContainer.innerText = "Speed: " + cat.speed;

    // Cost
    let costContainer = document.getElementById('bookletCost');
    costContainer.innerText = "Cost: " + cat.cost;
}

function createBookletPagination(baseCats) {
    let catBookletPaginationWrapper = document.createElement("div");
    catBookletPaginationWrapper.classList.add("catPaginationWrapper");
    let catBookletPagination = document.createElement("div");
    catBookletPagination.classList.add("catPagination")

    catBookletPagination.appendChild(createArrowBooklet("\u21A9", -1, "leftArrowBooklet"));
    
    for (let i = 0; i < baseCats.length; i++) {
        let button = document.createElement("button");
        button.innerText = i + 1;
        button.classList.add("paginationLink");
        if (i === 0) {
            button.classList.add("active");
        }
        button.value = i;
        button.onclick = () => setCatBookletInfo(i + 1, baseCats);
        catBookletPagination.appendChild(button);
    }
    
    catBookletPagination.appendChild(createArrowBooklet("\u21AA", 1, "rightArrowBooklet"));~

    catBookletPaginationWrapper.appendChild(catBookletPagination);
    
    return catBookletPaginationWrapper;
}

function createBooklet(baseCats) {
    let catBooklet = document.getElementById("catInfoGridContainer");

    let pagination = createBookletPagination(baseCats);
    catBooklet.appendChild(pagination);
}