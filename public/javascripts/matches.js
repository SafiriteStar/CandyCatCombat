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

        window.baseCats = result.baseCats
        document.getElementById('matchesMain').appendChild(createCatInfoSideBar(window.baseCats));
        document.getElementById('matchesMain').appendChild(createSideBarHelp(window.baseCats));
        calculateStatRanges(result.baseCats);
        // TODO: CREATE DEFAULT TEAM
        let mainContainers = document.getElementsByClassName('dt-mainContainer');
        for (let i = 0; i < mainContainers.length; i++) {
            mainContainers[i].appendChild(createDefaultTeamDisplay(result.team, result.baseCats));
        }

        // Set the create match button
        let createMatchButtons = document.getElementsByClassName('createMatchButton');
        for (let i = 0; i < createMatchButtons.length; i++) {
            createMatchButtons[i].onclick = async () => await createMatch();
        }

        // Check if any players have posted a match
        result = await requestWaitingMatches();

        if (!result.successful || result.err) { throw result.err || { err: "Not successful" } };

        fillMatches(result.matches);
    } catch (err) {
        console.log(err);
       // alert("Something went wrong!")
    }
}

function fillMatches(matches) {
    let tableBodies = document.getElementsByClassName('md-matchTableBody');
    let teamCostInput = document.getElementById('matchCostFilter');
    let maxBudget = Math.min(Math.max(Math.floor(teamCostInput.value), 1), 6);

    for (let i = 0; i < tableBodies.length; i++) {
        while (tableBodies[i].firstChild) {
            tableBodies[i].removeChild(tableBodies[i].firstChild);
        }

        for (let j = 0; j < matches.length; j++) {
            if (matches[j].maxCost != maxBudget) {
                continue;
            }
            let row = document.createElement('tr');
            row.classList.add('md-matchTableRow');

            let playerCell = document.createElement('td');
            playerCell.classList.add('md-matchPlayer');
            playerCell.appendChild(document.createTextNode(matches[j].opponents[0].name));
            row.appendChild(playerCell);

            let mapCell = document.createElement('td');
            mapCell.classList.add('md-matchMap');
            mapCell.appendChild(document.createTextNode(matches[j].boardName));
            row.appendChild(mapCell);

            let budgetCell = document.createElement('td');
            budgetCell.classList.add('md-matchBudget');
            budgetCell.appendChild(document.createTextNode(matches[j].maxCost));
            row.appendChild(budgetCell);

            let joinCell = document.createElement('td');
            joinCell.classList.add('md-matchJoin');
            let joinButton = document.createElement('button');
            joinButton.classList.add('removeButtonStyle');
            joinButton.classList.add('defaultButtonStyle');
            joinButton.classList.add('shortButton');
            joinButton.classList.add('md-matchJoinButton');
            joinButton.appendChild(document.createTextNode('Join'));
            
            joinButton.onclick = () => {
                playClick();
                join(matches[j].id);
            }
            
            joinCell.appendChild(joinButton);
            row.appendChild(joinCell);
            tableBodies[i].appendChild(row);
        }
        
    }
}

async function join(mId) {
    try {
        let result = await requestJoinMatch(mId);
        if (!result.successful || result.err) {
            throw result.msg || { err: "Not successful" }
        }
        else if (result.successful) {
            window.location.pathname = "/game.html"
        }
    } catch (err) {
        console.log(err);
        alert(err);
    }
}

async function refresh() {
    try {
        result = await requestWaitingMatches();

        if (!result.successful || result.err)
            throw result.err || { err: "Not successful" }

        fillMatches(result.matches);
    } catch (err) {
        console.log(err);
       // alert("Something went wrong!")
    }
}

async function createMatch() {
    try {
        let result = await requestCreateMatch();
        if (!result.successful || result.err) {
            throw result.msg || { err: "Not successfull" }
        }
        else {
            window.location.pathname = "/waiting.html"
        }
    } catch (err) {
        console.log(err);
        alert(err);
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