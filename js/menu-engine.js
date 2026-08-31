async function loadMenu() {

    try {

        const response =
            await fetch("config/menu.json");

        if (!response.ok) {
            throw new Error("No se pudo cargar menu.json");
        }

        const menuData =
            await response.json();

        renderMainMenu(menuData);

    } catch (error) {

        console.error(error);

        showError(
            "No se pudo cargar el menú.",
            "Comprueba la conexión e inténtalo de nuevo."
        );
    }
}


function renderMainMenu(menuData) {

    const content =
        document.getElementById("app-content");

    content.innerHTML = "";


    menuData.menus.forEach(menu => {

        const section =
            document.createElement("section");

        section.className =
            "menu-section mb-4";


        const title =
            document.createElement("h2");

        title.className =
            "h4 fw-bold mb-3";

        title.innerHTML = `
            <span class="me-2">
                ${menu.icon || ""}
            </span>

            ${menu.title}
        `;

        section.appendChild(title);


        const itemsContainer =
            document.createElement("div");

        itemsContainer.className =
            "row g-3";


        menu.items.forEach(item => {

            const column =
                document.createElement("div");

            column.className =
                "col-12 col-md-6";


            const button =
                createMenuButton(item);


            column.appendChild(button);

            itemsContainer.appendChild(column);

        });


        section.appendChild(itemsContainer);

        content.appendChild(section);

    });
}


function createMenuButton(item) {

    const button =
        document.createElement("button");


    button.className =
        "menu-button btn btn-light border w-100 text-start d-flex align-items-center gap-3 p-3";


    const icon =
        item.icon
            ? `<span class="fs-4">${item.icon}</span>`
            : "";


    const disabled =
        item.enabled === false;


    button.innerHTML = `

        ${icon}

        <span class="flex-grow-1">

            ${item.title}

        </span>

        ${
            disabled
                ? `
                    <span class="text-secondary small">
                        Próximamente
                    </span>
                  `
                : `
                    <span class="text-secondary fs-4">
                        ›
                    </span>
                  `
        }

    `;


    if (disabled) {

        button.disabled = true;

    } else {

        button.addEventListener(
            "click",
            () => openMenu(item)
        );

    }


    return button;
}


async function openMenu(item) {

    const content =
        document.getElementById("app-content");


    if (!item.config) {

        showPlaceholder(item.title);

        return;

    }


    try {

        const response =
            await fetch(item.config);


        if (!response.ok) {

            throw new Error(
                "No se pudo cargar la configuración."
            );

        }


        const config =
            await response.json();


        renderMenuContent(
            item,
            config
        );


    } catch (error) {

        console.error(error);

        showError(
            "No se pudo abrir esta opción.",
            "Inténtalo de nuevo."
        );

    }
}


function renderMenuContent(item, config) {

    const content =
        document.getElementById("app-content");


    content.innerHTML = `

        <div class="mb-4">

            <button
                id="back-button"
                class="btn btn-outline-secondary mb-3"
            >
                ← Menú
            </button>


            <div class="d-flex align-items-center gap-2">

                ${
                    item.icon
                        ? `<span class="fs-3">${item.icon}</span>`
                        : ""
                }

                <h2 class="h3 fw-bold mb-0">
                    ${item.title}
                </h2>

            </div>

        </div>


        <div class="text-center py-5">

            <p class="text-secondary">
                Configuración cargada correctamente.
            </p>

            <small class="text-secondary">
                ${config.title || ""}
            </small>

        </div>

    `;


    document
        .getElementById("back-button")
        .addEventListener(
            "click",
            loadMenu
        );
}


function showPlaceholder(title) {

    const content =
        document.getElementById("app-content");


    content.innerHTML = `

        <div class="mb-4">

            <button
                id="back-button"
                class="btn btn-outline-secondary mb-3"
            >
                ← Menú
            </button>

            <h2 class="h3 fw-bold">
                ${title}
            </h2>

        </div>


        <div class="text-center py-5">

            <p class="text-secondary">
                Próximamente
            </p>

        </div>

    `;


    document
        .getElementById("back-button")
        .addEventListener(
            "click",
            loadMenu
        );
}


function showError(title, message) {

    const content =
        document.getElementById("app-content");


    content.innerHTML = `

        <div class="alert alert-danger">

            <h2 class="h5">
                ${title}
            </h2>

            <p class="mb-3">
                ${message}
            </p>

            <button
                id="back-button"
                class="btn btn-outline-danger"
            >
                ← Volver
            </button>

        </div>

    `;


    document
        .getElementById("back-button")
        .addEventListener(
            "click",
            loadMenu
        );
}