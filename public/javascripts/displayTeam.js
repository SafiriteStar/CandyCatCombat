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

async function createCellButton(classList, value, onclick, catName, catImagePaths) {
    let button = document.createElement('button');
    for (let i = 0; i < classList.length; i++) {
        button.classList.add(classList[i]);
    }

    if (value !== null) {
        button.value = value;
    }

    if (onclick !== null) {
        button.setAttribute('onclick', onclick);
    }

    for (let i = 0; i < catImagePaths.length; i++) {
        let catImage = document.createElement('img');
        catImage.classList.add('defaultCatImage');
        catImage.src = catImagePaths[i];
        button.appendChild(catImage);
    }
    
    let catText = document.createElement('p');
    catText.classList.add('defaultCatText');
    catText.innerText = catName;
    button.appendChild(catText);

    return button;
}

async function createTeamCell(cat, baseCats, catImagePaths) {

    let tableCell = document.createElement('td');
    tableCell.classList.add('defaultTeamCell');

    let dropdown = document.createElement('div');
    dropdown.classList.add('defaultCatDropdown');
    // Button that displays our currently selected cat
    let selectButton = await createCellButton(['defaultCatSelectedButton', 'defaultCatOption'], null, null, baseCats[cat.cat_id - 1].name, catImagePaths[cat.cat_id -1]);
    dropdown.appendChild(selectButton);
    // Drop down that shows all cats
    let dropdownContent = document.createElement('div');
    dropdownContent.classList.add('defaultCatDropdownContent');
    // Create a button for each base cat that lets you change the selected cat into that one
    for (let i = 0; i < baseCats.length; i++) {
        let changeCatButton = await createCellButton(['defaultCatOption'], baseCats[i].cat_id, `catOnChange(${cat.id}, ${baseCats[i].cat_id})`, baseCats[i].name, catImagePaths[baseCats[i].cat_id - 1]);
        dropdownContent.appendChild(changeCatButton);
    }

    // Create a button to remove the currently selected cat
    let catRemoveButton = await createCellButton(['defaultCatOption'], null, `removeCatOnClick(${cat.id})`, `Remove Cat`, [`./assets/UI/CrossOption.png`]);
    dropdownContent.appendChild(catRemoveButton);

    dropdown.appendChild(dropdownContent);

    tableCell.appendChild(dropdown);

    return tableCell;
}

async function createAddCatCell(baseCats, catImagePaths) {

    let tableCell = document.createElement('td');
    tableCell.classList.add('defaultTeamCell');

    let dropdown = document.createElement('div');
    dropdown.classList.add('defaultCatDropdown');
    
    let addButton = await createCellButton(['defaultCatOption'], null, null, `Add Cat`, [`./assets/UI/AddOption.png`]);
    dropdown.appendChild(addButton);

    // Drop down that shows all cats
    let dropdownContent = document.createElement('div');
    dropdownContent.classList.add('defaultCatDropdownContent');
    // Create a button for each baseCat to add it to the team
    for (let i = 0; i < baseCats.length; i++) {
        let changeCatButton = await createCellButton(['defaultCatOption'], baseCats[i].cat_id, `addCatOnClick(${baseCats[i].cat_id})`, baseCats[i].name, catImagePaths[baseCats[i].cat_id - 1]);
        dropdownContent.appendChild(changeCatButton);
    }

    dropdown.appendChild(dropdownContent);

    tableCell.appendChild(dropdown);

    return tableCell;
}

async function createTeamDropDown(team, baseCats) {
    let catImagePaths = [
        ['./assets/VanillaCat/Peppermint_Shield.png', './assets/VanillaCat/Vanilla_Cat_Base.png', './assets/VanillaCat/Candy_Cane_Sword.png'],
        ['./assets/CandyCornCat/Candy_Corn_Cat_Base.png', './assets/CandyCornCat/Chocolate_and_Strawberry_Bow.png'],
        ['./assets/MawbreakerCat/Mawbreaker_Cat_Base.png', './assets/MawbreakerCat/Candy_Axe_NR.png'],
        ['./assets/GumCat/Gum_Cat_Base.png', './assets/GumCat/Daggers.png'],
        ['./assets/PopCandyCat/Pop_Candy_Cat_Base.png', './assets/PopCandyCat/Pop_Rocks.png'],
        ['./assets/CaramelCat/Caramel_Cat_Base.png', './assets/CaramelCat/Sticky_Caramel.png'],
        ['./assets/ChocoDairyMilkCat/Choco_Dairy_Milk_Cat_Base.png', './assets/ChocoDairyMilkCat/Healing_Kit.png'],
    ];

    // Create the table
    let table = document.createElement('table');
    table.classList.add('defaultTeamTable');
    // Table Body
    let tableBody = document.createElement('tbody');
    // The row to show all team cats
    let tableRow = document.createElement('tr');
    tableRow.classList.add('defaultTeamRow');

    // For cat in the default team
    for (let i = 0; i < team.length; i++) {
        // Make a cell for that cat
        let catCell = await createTeamCell(team[i], baseCats, catImagePaths);
        // And add it to the row
        tableRow.appendChild(catCell);
    }

    // For each cat below 6
    for (let i = 0; i < 6 - team.length; i++) {
        let addCatCell = await createAddCatCell(baseCats, catImagePaths);
        tableRow.appendChild(addCatCell);
    }

    tableBody.appendChild(tableRow);
    table.appendChild(tableBody);

    return table;
}

async function remakeTable() {
    // Get default team
    result = await requestDefaultTeam();

    let tableContainers = document.getElementsByClassName('defaultTeamTableContainer');
    for (let tableContainer of tableContainers) {
        tableContainer.innerHTML = '';
        tableContainer.appendChild(await createTeamDropDown(result.team, result.baseCats));
    }
}