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

        createTeamDropDown(result.team);

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

function createTeamDropDown(team) {
    console.log(team);

    // Where we are going to attach the table
    const element = document.getElementById("defaultTeam"); 

    // The table
    const defaultTeamTable = document.createElement('table');
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
    for (let i = 0; i < team.length; i++) {
        // New Cat
        const catRow = defaultTeamTable.insertRow();
        
        // All cat data
        for (let j = 0; j < catBrackets.length; j++) {
            const catName = catRow.insertCell();
            catName.appendChild(document.createTextNode(team[i][catBrackets[j]]));
            catName.style.border = '1px solid black';
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