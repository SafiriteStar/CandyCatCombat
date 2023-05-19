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