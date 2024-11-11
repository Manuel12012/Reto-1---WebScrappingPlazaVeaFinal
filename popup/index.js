const buttonScrapt = document.getElementById("btn-scrap");
const buttonProducts = document.getElementById("btn-product");
const txtData = document.getElementById("txt-data");
const port = chrome.runtime.connect({ name: "background" });

buttonScrapt.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { cmd: "scrap" });
});

buttonProducts.addEventListener("click", async () => {
    // Solicitar los productos desde el almacenamiento local
    chrome.storage.local.get("products", function (result) {
        if (result.products) {
            // Mostrar los productos en formato JSON en el popup
            txtData.innerText = JSON.stringify(result.products, null, 2);
        } else {
            txtData.innerText = "No se encontraron productos.";
        }
    });
});
