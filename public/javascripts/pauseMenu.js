function togglePauseMenu() {
    playClick();
    let pauseMenus = document.getElementsByClassName('pauseMenuFrame');
    for (let i = 0; i < pauseMenus.length; i++) {
        pauseMenus[i].classList.toggle('pauseSwitch');
    }
}

async function quitGame() {
    playClick();
    if(confirm("Are you sure you want to quit?")) {
        await cancelGame();
        window.location.reload();
    }
}

function changeVolumeValue(volume) {
    console.log(volume);
    let backgroundMusics = document.getElementsByClassName('audio');

    for (let i = 0; i < backgroundMusics.length; i++) {
        backgroundMusics[i].volume = volume * 0.01;
    }
}