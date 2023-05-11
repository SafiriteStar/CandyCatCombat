window.onload = async function() {
    try {
        let result = await checkGame(true);
        if (result.err) throw result.err;
        
        // Get default team
        result = await requestDefaultTeam();
        if (!result.successful || result.err) { throw result.err || { err: "Not successful" } }
        createBooklet(result.baseCats);
    } catch (err) {
        console.log(err);
    }
}

