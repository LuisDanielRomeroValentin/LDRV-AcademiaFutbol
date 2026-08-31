// Registro del Service Worker (habilita instalación y uso offline)
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("service-worker.js")
            .then((registration) => {
                console.log("Service Worker registrado:", registration.scope);
            })
            .catch((error) => {
                console.error("Error registrando el Service Worker:", error);
            });

    });

}


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