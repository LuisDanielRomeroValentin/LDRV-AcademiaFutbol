const enterButton =
    document.getElementById("enter-button");

const homeScreen =
    document.getElementById("home-screen");

const menuScreen =
    document.getElementById("menu-screen");


enterButton.addEventListener("click", () => {

    homeScreen.classList.add("d-none");

    menuScreen.classList.remove("d-none");

    loadMenu();

});