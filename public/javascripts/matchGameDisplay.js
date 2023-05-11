function createMatchDisplayItem(match) {
    let display = document.createElement("div");
    display.classList.add('matchDisplay');

    let backgroundImage = document.createElement('img');
    backgroundImage.classList.add('matchBackgroundImage');
    backgroundImage.alt = 'Match Display Background Image';
    backgroundImage.src = './assets/UI/MatchGameDisplay.png';
    display.appendChild(backgroundImage);

    // Context Container
    let contextContainer = document.createElement('section')
    contextContainer.classList.add('matchContext');

    // Map Name Container
    let mapNameContainer = document.createElement('div');
    mapNameContainer.classList.add('matchInfoContainer');
    mapNameContainer.classList.add('matchMapInfoContainer');
    mapNameContainer.classList.add('clearfix');

    // Map Name Context
    let mapNameContext = document.createElement("p");
    mapNameContext.classList.add('matchInfoContext');
    let mapNameContextText = document.createTextNode(`Map:`);
    mapNameContext.appendChild(mapNameContextText);
    mapNameContainer.appendChild(mapNameContext);
    
    // Map Name Content
    let mapNameContent = document.createElement("p");
    mapNameContent.classList.add('matchInfoContent');
    let mapNameContentText = document.createTextNode(`${match.boardName}`);
    mapNameContent.appendChild(mapNameContentText);
    mapNameContainer.appendChild(mapNameContent);
    
    contextContainer.appendChild(mapNameContainer);

    // Tem Cost Container
    let teamCostContainer = document.createElement('div');
    teamCostContainer.classList.add('matchInfoContainer');
    teamCostContainer.classList.add('matchTeamCostInfoContainer');
    teamCostContainer.classList.add('clearfix');

    // Team Cost Context
    let teamCostContext = document.createElement("p");
    teamCostContext.classList.add('matchInfoContext');
    let teamCostContextText = document.createTextNode(`Max Cost:`);
    teamCostContext.appendChild(teamCostContextText);
    teamCostContainer.appendChild(teamCostContext);

    // Team Cost Content
    let teamCostContent = document.createElement("p");
    teamCostContent.classList.add('matchInfoContent');
    let teamCostContentText = document.createTextNode(`6`);
    teamCostContent.appendChild(teamCostContentText);
    teamCostContainer.appendChild(teamCostContent);

    contextContainer.appendChild(teamCostContainer);

    // Join Button Container
    let joinButtonContainer = document.createElement('div');
    joinButtonContainer.classList.add('matchInfoContainer');
    joinButtonContainer.classList.add('matchJoinButtonContainer');
    
    // Join Button
    let joinButton = document.createElement("BUTTON");
    joinButton.classList.add('matchJoinButton');
    joinButton.onclick = () => join(match.id);
    joinButtonContainer.appendChild(joinButton);

    // Join Button Background Image
    let joinButtonBackgroundImage = document.createElement('img');
    joinButtonBackgroundImage.classList.add('joinButtonBackgroundImage');
    joinButtonBackgroundImage.src = './assets/UI/MatchJoinButton.png'
    joinButtonBackgroundImage.alt = 'Join Button Image';
    joinButton.appendChild(joinButtonBackgroundImage);

    let joinButtonContext = document.createElement('p');
    joinButtonContext.appendChild(document.createTextNode(`Join ${match.opponents[0].name}`));
    joinButton.appendChild(joinButtonContext);

    contextContainer.appendChild(joinButtonContainer);

    display.appendChild(contextContainer);

    return display;
}

function createMatchDisplayTable(matches) {
    let table = document.getElementById("matches");
    table.classList.add('matchTable');
    
    for (let match of matches) {
        // If we are starting the table or if we have reached 5 cells in this row
        if (table.rows.length === 0 || table.rows[table.rows.length - 1].cells.length >= 5) {
            // Start a new row
            let row = document.createElement('tr');
            row.classList.add('matchRow');
            table.appendChild(row);
        }
        let cell = document.createElement('td');
        cell.classList.add('matchCell');
        let tableItem = createMatchDisplayItem(match);
        cell.appendChild(tableItem);
        table.rows[table.rows.length - 1].appendChild(cell);
    }
}