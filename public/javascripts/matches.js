window.onload = async function () {
    try {
        // Check we are authenticated
        let result = await checkAuthenticated(true);

        if (result.err) {  throw result.err; }

        document.getElementById('player').textContent = "Hello " + window.user.name;
    
        // Check we are in a game
        result = await checkGame(true);
    
        if (result.err) { throw result.err };

        // Get default team
        result = await requestDefaultTeam();
        
        if (!result.successful || result.err) { throw result.err || { err: "Not successful" } }

        await createTeamDropDown(result.team, result.baseCats);

        // Check if any players have posted a match
        result = await requestWaitingMatches();

        if (!result.successful || result.err) { throw result.err || { err: "Not successful" } };

        fillMatches(result.matches);
    } catch (err) {
        console.log(err);
       // alert("Something went wrong!")
    }
}

let headerCells = [
    "Name",
    "Health",
    "Damage",
    "Defense",
    "Speed",
    "Max Range",
    "Min Range",
    "Cost"
]

let catBrackets = [
    "name",
    "health",
    "damage",
    "defense",
    "speed",
    "max_range",
    "min_range",
    "cost"
]

async function remakeTable() {
    // Delete the table
    document.getElementById("defaultTeamTable").remove();

    // Get default team
    result = await requestDefaultTeam();

    await createTeamDropDown(result.team, result.baseCats);
}

async function catOnChange(teamCatID, newCatID) {
    await requestChangeDefaultCat(newCatID, teamCatID);
    await remakeTable();
}

async function addCatOnClick(newCatID) {
    await requestAddDefaultCat(newCatID);
    await remakeTable();
}

async function removeCatOnClick(teamCatID) {
    await requestRemoveDefaultCat(teamCatID);
    await remakeTable();
}

async function createTeamDropDown(team, baseCats) {
    console.log(team);
    console.log(baseCats);

    // Where we are going to attach the table
    const element = document.getElementById("defaultTeam"); 

    // The table
    const defaultTeamTable = document.createElement('table');
    defaultTeamTable.id = "defaultTeamTable";
    defaultTeamTable.style.border = '1px solid black';

    // Header rows
    const headerRow = defaultTeamTable.insertRow();

    // Header Cells
    for (let i = 0; i < headerCells.length; i++) {
        const headerCell = headerRow.insertCell();
        headerCell.appendChild(document.createTextNode([headerCells[i]]));
        headerCell.style.border = '1px solid black';
    }

    // For each cat
    for (let i = 0; i < team.length + 1; i++) {
        // New Cat
        const catRow = defaultTeamTable.insertRow();
        
        if (i === team.length) {
            const catData = catRow.insertCell();
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Add';
            removeButton.setAttribute('onClick', 'addCatOnClick(this.value)');
            removeButton.value = 1;
            catData.appendChild(removeButton);
            catData.style.border = '1px solid black';
        }
        else {
            // All cat data
            for (let j = 0; j < catBrackets.length + 1; j++) {
                if (j === 0) {
                    const catSelect = document.createElement('select');
                    catSelect.name = "catSelect";
                    catSelect.id = "catSelect";
    
                    for (let k = 0; k < baseCats.length; k++) {
                        const catOption = document.createElement('option');
                        catOption.value = team[i].id;
                        catOption.appendChild(document.createTextNode(baseCats[k].name));
                        catOption.index = baseCats[k].id;
                        if (baseCats[k].name === team[i][catBrackets[j]]) {
                            catOption.selected = "selected";
                        }
    
                        catSelect.appendChild(catOption);
                    }
    
                    catSelect.setAttribute('onChange', 'catOnChange(this.options[this.selectedIndex].value, this.options[this.selectedIndex].index + 1)')
    
                    const catData = catRow.insertCell();
                    catData.appendChild(catSelect);
                    catData.style.border = '1px solid black';
                }
                else if (j === catBrackets.length) {
                    const catData = catRow.insertCell();
                    const removeButton = document.createElement('button');
                    removeButton.innerText = 'Remove';
                    removeButton.value = team[i].id
                    removeButton.setAttribute('onClick', 'removeCatOnClick(this.value)');
                    catData.appendChild(removeButton);
                    catData.style.border = '1px solid black';
                }
                else {
                    const catData = catRow.insertCell();
                    catData.appendChild(document.createTextNode(team[i][catBrackets[j]]));
                    catData.style.border = '1px solid black';
                }
            }
        }
    }

    element.appendChild(defaultTeamTable);
    
}

function fillMatches(matches) {
    let container = document.getElementById("matches");
    for (let match of matches) {

        let section = document.createElement("section");
        let joinButton = document.createElement("BUTTON");
        let joinText = document.createTextNode(`Join ${match.opponents[0].name}`);
        joinButton.onclick = () => join(match.id);
        joinButton.appendChild(joinText);
        section.appendChild(joinButton);
        container.appendChild(section);
    }
}

async function join(mId) {
    try {
        let result = await requestJoinMatch(mId);
        if (!result.successful || result.err)
            throw result.err || { err: "Not successfull" }
        window.location.pathname = "/game.html"
    } catch (err) {
        console.log(err);
    //  alert("Something is not working");
    }
}

async function refresh() {
    try {
        result = await requestWaitingMatches();

        if (!result.successful || result.err)
            throw result.err || { err: "Not successfull" }

        // remove everything to fill again:
        let parent = document.getElementById("matches");
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        fillMatches(result.matches);
    } catch (err) {
        console.log(err);
       // alert("Something went wrong!")
    }
}

async function createMatch() {
    try {
        let result = await requestCreateMatch();
        if (!result.successful || result.err)
            throw result.err || { err: "Not successfull" }
        window.location.pathname = "/waiting.html"
    } catch (err) {
        console.log(err);
      //  alert("Something is not working");
    }
}


async function logout() {
    try {
        let result = await requestLogout();
        if (!result.successful || result.err)
            throw result.err || { err: "Not successfull" }
        window.location.pathname = "/index.html"
    } catch (err) {
        console.log(err);
       // alert("Something is not working");
    }
}