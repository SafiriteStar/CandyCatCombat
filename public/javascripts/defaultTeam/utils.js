function removeAllCatOverlays() {
    let catOverlays = document.getElementsByClassName('dt-catContainer');
    for (let i = 0; i < catOverlays.length; i++) {
        catOverlays[i].classList.remove('dt-catContainerActive');
    }
}

function showCatOverlay(element, cat) {
    // Remove from all other elements first
    removeAllCatOverlays();
    // Then show for this one
    element.classList.add('dt-catContainerActive');
    // Also update the side bar
    updateCatInfoIndex(cat);
}

function updateCatInfoIndex(index) {
    updateCatInfoSideBar(window.baseCats[index], window.baseCats, "ignore");
}

function calculateTeamCost(team, baseCats) {
    let totalCost = 0;

    for (let i = 0; i < team.length; i++) {
        if (team[i].enabled == 1) {
            totalCost = totalCost + baseCats[team[0].cat_id -1].cost;
        }
    }

    return totalCost;
}

async function updateSelectedCats() {
    let result = await requestDefaultTeam();
    let team = result.team;
    
    for (let i = 0; i < team.length; i++) {
        let selectedCatImage = document.getElementById('selectedCatImage' + team[i].id);
        if (team[i].enabled == true) {
            selectedCatImage.src = catImagePaths[team[i].cat_id - 1][0];
        }
        else if (team[i].enabled == false) {
            selectedCatImage.src = "/assets/UI/AddOption.png";
        }
    }

    let teamCost = calculateTeamCost(result.team, result.baseCats);
    for (let i = 1; i <= 7; i++) {
        let catOptions = document.getElementsByClassName('catType' + i);
        for (let j = 0; j < catOptions.length; j++) {
            if (teamCost - 1 + result.baseCats[i - 1].cost <= 6) {
                catOptions[j].classList.remove("dt-unavailableOption");
            }
            else {
                catOptions[j].classList.add("dt-unavailableOption");
            }
        }
    }
}

async function changeDefaultCat(catId, teamId) {
    await requestChangeDefaultCat(catId, teamId);
    await updateSelectedCats();
}

async function removeDefaultCat(teamId) {
    await requestRemoveDefaultCat(teamId);
    await updateSelectedCats();
}