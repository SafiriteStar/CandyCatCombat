async function requestRegister(user, pass, conf) {
    try {
        const response = await fetch(`/api/users/`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "POST",
          body: JSON.stringify({
              username: user,
              password: pass,
              confirm:  conf
          })
        });
        // We are not checking for errors (considering the GUI is only allowing correct choices)
        // We only need to send if the user registered or not 
        return { successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestLogin(user, pass) {
    try {
        const response = await fetch(`/api/users/auth`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "POST",
          body: JSON.stringify({
              username: user,
              password: pass
          })
        });
        // We are not checking for errors (considering the GUI is only allowing correct choices)
        // We only need to send if the user logged or not since the token will be in the cookie
        return { successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}


async function requestLogout() {
    try {
        const response = await fetch(`/api/users/auth`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE",
        });
        // We are not checking for errors (considering the GUI is only allowing correct choices)
        // We only need to send if the user logged or not since the token will be in the cookie
        return { successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}


async function requestProfile() {
    try {
        const response = await fetch(`/api/users/auth`);
        var result = await response.json();
        return { successful: response.status == 200,
                 unauthenticated: response.status == 401,
                 user: result};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestDefaultTeam() {
    try {
        const response = await fetch(`/api/users/auth/defaultteam`);
        let result = await response.json();
        return { successful: response.status == 200,
                 unauthenticated: response.status == 401,
                 team: result.teamData,
                 baseCats: result.baseCats };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestChangeDefaultCat(newCatID, teamCatID) {
    try {
        const response = await fetch(`/api/users/auth/changedefaultcat`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify({
                newCatID: newCatID,
                teamCatID: teamCatID
            })
        });

        return { successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestAddDefaultCat(newCatID) {
    try {
        const response = await fetch(`/api/users/auth/adddefaultcat`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                newCatID: newCatID
            })
        });

        return { successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestRemoveDefaultCat(teamCatID) {
    try {
        const response = await fetch(`/api/users/auth/removedefaultcat`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify({
                teamCatID: teamCatID
            })
        });

        return { successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}