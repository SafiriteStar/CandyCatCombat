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

        // TODO: CREATE DEFAULT TEAM

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

        // remove everything to fill again:
        let parent = document.getElementById("matches");
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        console.log(result.matches);
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