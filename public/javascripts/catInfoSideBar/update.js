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
    let statsImage = ['/assets/UI/healthStat.png', '/assets/UI/damageStat.png', '/assets/UI/defenseStat.png'];

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
            let statImagePath = (stats[i] == 'damage' && cat.cat_id == 7) && '/assets/UI/healingStat.png' || statsImage[i];
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
                let statStar = createStatStar(catImagePaths[cat.cat_id - 1][1], 'Range Tick');
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
            let statStar = createStatStar('/assets/UI/costStat.png', 'Cost');
            costStatVisuals[i].appendChild(statStar);
        }
    }

    let catDescriptions = document.getElementsByClassName('catInfoDescription');

    for (let i = 0; i < catDescriptions.length; i++) {
        catDescriptions[i].innerHTML = '';
        catDescriptions[i].appendChild(document.createTextNode(cat.description));
    }
}