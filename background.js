chrome.runtime.onConnect.addListener(function (port) {
    console.log('Conexión establecida con el content-script.');

    port.onMessage.addListener(function (msg) {
        if (msg.cmd === "finish-scrap") {
            const { products } = msg;

            // Usar el callback en lugar de .then()
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
