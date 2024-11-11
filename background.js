// Código en background.js

chrome.runtime.onConnect.addListener(function (port) {
    console.log('Conexión establecida con el content-script.');

    port.onMessage.addListener(function (msg) {
        if (msg.cmd === "finish-scrap") {
            const { products } = msg;

            
            chrome.storage.local.remove("products", function () {
                // Verifica si ocurrió un error al eliminar
                if (chrome.runtime.lastError) {
                    console.error("Error al eliminar productos antiguos:", chrome.runtime.lastError);
                } else {
                    console.log("Productos antiguos eliminados.");
                }
            });

            // Ahora guardamos los nuevos productos
            chrome.storage.local.set({ "products": products }, function () {
                if (chrome.runtime.lastError) {
                    console.error("Error al guardar los productos:", chrome.runtime.lastError);
                } else {
                    console.log("Productos guardados en el almacenamiento local.");
                }
            });
        }
    });

    port.onDisconnect.addListener(() => {
        console.log('Conexión con el content-script cerrada.');
    });
});

// Función para navegar por las categorías y hacer scraping
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd === "scrap-categories") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: scrapeCategories
            });
        });
    }
});

// Función de scraping de categorías
function scrapeCategories() {
    const categoryLinks = getCategoryLinks();

    
    for (let i = 0; i < categoryLinks.length; i++) {
        fetchCategoryProducts(categoryLinks[i], i);
    }
}

// Función para hacer scraping de los productos en cada categoría
async function fetchCategoryProducts(link, index) {
    
    window.location.href = link;
    await new Promise(resolve => setTimeout(resolve, 3000));  

    
    const products = scrappingProducts();

    
    chrome.runtime.sendMessage({ cmd: "finish-scrap", products });
}

// Función para obtener los enlaces de categorías
function getCategoryLinks() {
    const categoryLinks = [];
    const categoryElements = document.querySelectorAll('ul.dropdown__list.dropdown__list--active a[href^="/"]');
    categoryElements.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith("/")) {
            categoryLinks.push("https://www.plazavea.com.pe" + href);
        }
    });
    return categoryLinks;
}

// Función para hacer scraping de productos de cada categoría
function scrappingProducts() {
    let cards = document.querySelectorAll("div.showcase-grid>div>.Showcase__content");
    cards = [...cards];
    const products = cards.map(x => {
        const name = x.querySelector("button.Showcase__name")?.textContent;
        const sellerName = x.querySelector(".Showcase__SellerName")?.textContent;
        const salePrice = x.querySelector("div.Showcase__salePrice")?.textContent;
        return { name, sellerName, salePrice };
    });
    console.log(products);
    return products;
}
