function showHideElement(button, targetElementId, displayMode) {
    button.classList.toggle('switch');
    
    let targetElement = document.getElementById(targetElementId);
    if (targetElement.style.display === "none" || targetElement.style.display === '') {
        targetElement.style.display = displayMode;
    }
    else {
        targetElement.style.display = "none"
    }
}