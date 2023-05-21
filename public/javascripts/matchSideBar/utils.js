function toggleMatchSideBar () {
    let mainContainers = document.getElementsByClassName('md-mainContainer');

    for (let i = 0; i < mainContainers.length; i++) {
        mainContainers[i].classList.toggle('md-mainContainerActive');
    }
}