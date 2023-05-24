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
            totalCost = totalCost + baseCats[team[i].cat_id -1].cost;
        }
    }

    return totalCost;
}

async function updateSelectedCats() {
    let result = await requestDefaultTeam();
    let team = result.team;
    let teamCost = calculateTeamCost(result.team, result.baseCats);

    for (let i = 0; i < team.length; i++) {
        let teamCat = document.getElementById('teamCat' + team[i].id);
        teamCat.setAttribute('onmouseenter', `showCatOverlay(this, ${team[i].cat_id - 1})`);
        let teamCatChildren = teamCat.children;
        for (let j = 0; j < teamCatChildren.length; j++) {
            // Change the selected cat image
            if (teamCatChildren[j].classList.contains('dt-selectedCat')) {
                let selectedCatContainer = teamCatChildren[j];
                let selectedCatContainerChildren = selectedCatContainer.children;
                for (let k = 0; k < selectedCatContainerChildren.length; k++) {
                    if (selectedCatContainerChildren[k].classList.contains('dt-selectedCatImage')) {
                        if (team[i].enabled == true) {
                            selectedCatContainerChildren[k].src = catImagePaths[team[i].cat_id - 1][0];
                        }
                        else if (team[i].enabled == false) {
                            selectedCatContainerChildren[k].src = "/assets/UI/AddOption.png";
                        }
                    }
                }
            }
            else if (teamCatChildren[j].classList.contains('dt-catOverlay')) {
                overlayChildren = teamCatChildren[j].children;

                for (let k = 0; k < overlayChildren.length; k++) {
                    for (let l = 0; l < result.baseCats.length; l++) {
                        if (overlayChildren[k].classList.contains('dt-catOptionType' + result.baseCats[l].cat_id)) {
                            let optionChildren = overlayChildren[k].children;
                            for (let m = 0; m < optionChildren.length; m++) {
                                if (optionChildren[m].classList.contains('dt-catOptionInner')) {
                                    let innerChildren = optionChildren[m].children;
                                    for (let n = 0; n < innerChildren.length; n++) {
                                        if (innerChildren[n].classList.contains('dt-catOptionBack')) {
                                            let backChildren = innerChildren[n].children;
                                            for (let o = 0; o < backChildren.length; o++) {
                                                if (backChildren[o].classList.contains('dt-optionCatImage')) {
                                                    // We got to the image of the option
                                                    let image = backChildren[o];
                                                    if (result.baseCats[k] !== null && result.baseCats[k] !== undefined) {
                                                        // We are at an option that is a cat
                                                        let selectedCatCost = 0;
                                                        if (team[i].enabled == true) {
                                                            selectedCatCost = result.baseCats[team[i].cat_id - 1].cost;
                                                        }

                                                        if (teamCost - selectedCatCost + result.baseCats[l].cost <= 6) {
                                                            image.classList.remove('dt-unavailableOption');
                                                        }
                                                        else {
                                                            image.classList.add('dt-unavailableOption');
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    let teamCostTexts = document.getElementsByClassName('dt-teamCostText');
    for (let i = 0; i < teamCostTexts.length; i++) {
        teamCostTexts[i].innerHTML = `${teamCost}/6`;
    }
}

async function changeDefaultCat(catId, teamId, element) {
    let unavailableOption = false;
    for (let i = 0; i < element.children.length; i++) {
        if (element.children[i].classList.contains('dt-catOptionInner')) {
            let innerChildren = element.children[i].children;
            for (let j = 0; j < innerChildren.length; j++) {
                if (innerChildren[j].classList.contains('dt-catOptionBack')) {
                    let backChildren = innerChildren[j].children;
                    for (let k = 0; k < backChildren.length; k++) {
                        if (backChildren[k].classList.contains('dt-unavailableOption')) {
                            unavailableOption = true;
                        }
                    }
                }
            }
        }
        
    }
    if (unavailableOption === false) {
        await requestChangeDefaultCat(catId, teamId);
        await updateSelectedCats();
    }
}

async function removeDefaultCat(teamId) {
    await requestRemoveDefaultCat(teamId);
    await updateSelectedCats();
}