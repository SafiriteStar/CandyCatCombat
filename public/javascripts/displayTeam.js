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

function createCatRowData(catRow, cat, baseCats) {
    let baseCatKeys = Object.keys(baseCats[cat.cat_id - 1]);
    let dataDisplayRangeStart = 1;
    let dataDisplayRangeEnd = baseCatKeys.length - 2;

    for (let i = dataDisplayRangeStart; i < dataDisplayRangeEnd; i++) {
        // Insert a new cell
        const cell = catRow.insertCell();

        // If we are at the name
        if (i === dataDisplayRangeStart) {
            const catSelect = document.createElement('select');
            catSelect.name = "catSelect";
            catSelect.id = "catSelect";
            // Create a drop down menu
            for (let j = 0; j < baseCats.length; j++) {
                // Create an option in the drop down menu
                const catOption = document.createElement('option');
                catOption.value = cat.id;
                catOption.appendChild(document.createTextNode(baseCats[j].name));
                catOption.index = baseCats[j].id;
                // If this is the cat we are, then set this option as the selected one
                if (baseCats[j].name === baseCats[cat.cat_id - 1][baseCatKeys[i]]) {
                    catOption.selected = "selected";
                }
                // Add the option to the drop down menu
                catSelect.appendChild(catOption);
            }
            // Add the functionality to actually change cats
            catSelect.setAttribute('onChange', 'catOnChange(this.options[this.selectedIndex].value, this.options[this.selectedIndex].index + 1)')
            // Add the drop down menu to the cell
            cell.appendChild(catSelect);
            cell.style.border = '1px solid black';
        }
        // If we are on the last cell
        else if (i === dataDisplayRangeEnd - 1) {
            // Add the remove button
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.value = cat.id
            removeButton.setAttribute('onClick', 'removeCatOnClick(this.value)');
            cell.appendChild(removeButton);
            cell.style.border = '1px solid black';
        }
        else {
            // Add all the data in between
            cell.appendChild(document.createTextNode(baseCats[cat.cat_id - 1][baseCatKeys[i]]));
            cell.style.border = '1px solid black';
        }
    }
}

async function createTeamDropDown(team, baseCats) {

    // Where we are going to attach the table
    const element = document.getElementById("defaultTeamTableWrapper"); 

    // The table
    const defaultTeamTable = document.createElement('table');
    defaultTeamTable.id = "defaultTeamTable";
    defaultTeamTable.classList.add('defaultTeamTable');
    defaultTeamTable.style.border = '1px solid black';

    // Header rows
    const headerRow = defaultTeamTable.insertRow();

    let headerColumns = [
        "Name",
        "Health",
        "Damage",
        "Defense",
        "Speed",
        "Cost"
    ]

    // Header Cells
    for (let i = 0; i < headerColumns.length; i++) {
        const headerCell = headerRow.insertCell();
        headerCell.appendChild(document.createTextNode([headerColumns[i]]));
        headerCell.style.border = '1px solid black';
    }

    // For each cat
    for (let i = 0; i < team.length + 1; i++) {
        // New Cat
        const catRow = defaultTeamTable.insertRow();
        
        // Add in the remove button
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
            createCatRowData(catRow, team[i], baseCats);
        }
    }

    element.appendChild(defaultTeamTable);
}

async function remakeTable() {
    // Delete the table
    document.getElementById("defaultTeamTable").remove();

    // Get default team
    result = await requestDefaultTeam();

    await createTeamDropDown(result.team, result.baseCats);
}