function togglePauseMenu() {
    let pauseMenus = document.getElementsByClassName('pauseMenuFrame');
    for (let i = 0; i < pauseMenus.length; i++) {
        pauseMenus[i].classList.toggle('pauseSwitch');
    }
}

async function quitGame() {
    if(confirm("Are you sure you want to quit?")) {
        await cancelGame();
        window.location.reload();
    }
}

function changeVolumeValue(volume) {
    GameInfo.sounds.background.setVolume(volume);
 }