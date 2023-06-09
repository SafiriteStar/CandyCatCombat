function makeDivDraggable(div) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    if (document.getElementById(div.id + "header")) {
        // If present, the header is where you move the DIV from:
        document.getElementById(div.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        div.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        let divRect = div.getBoundingClientRect();
        let xGraceSpace = divRect.width * 0.75;
        let yGraceSpace = divRect.height * 0.75;
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        if (divRect.x - pos1 > -xGraceSpace && divRect.x - pos1 + divRect.width < window.innerWidth + xGraceSpace &&
            divRect.y - pos2 > -yGraceSpace && divRect.y - pos2 + divRect.height < window.innerHeight + yGraceSpace) {
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
                div.style.top = (div.offsetTop - pos2) + "px";
                div.style.left = (div.offsetLeft - pos1) + "px";
            }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function createMouseOverFunctions(element) {
    // If we aren't in a game
    let p5Canvases = document.getElementsByClassName('p5Canvas');
    if (p5Canvases.length == 0) {
        // Then stop
        return
    }

    element.addEventListener("mouseleave", function (event) {
        GameInfo.isMouseOverMenu = false;
        event.target.textContext = "mouse out";
    }, false);

    element.addEventListener("mouseover", function (event) {
        GameInfo.isMouseOverMenu = true;
        event.target.textContext = "mouse in";
    }, false);
}