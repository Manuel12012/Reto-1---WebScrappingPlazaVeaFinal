let port = chrome.runtime.connect({name: "background"});
console.log("Ejecutando content script Plaza Vea");

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

function sendToBackground(products) {
    if (port) {
        port.postMessage({ cmd: "finish-scrap", products });
    } else {
        console.error('La conexión con el background ha sido cerrada.');
    }
}

// El content-script solo se encarga de extraer los productos de la página actual
function scrapeCurrentPage() {
    const products = scrappingProducts();
    sendToBackground(products);  
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd === "scrap") {
        scrapeCurrentPage();  
    }
});
