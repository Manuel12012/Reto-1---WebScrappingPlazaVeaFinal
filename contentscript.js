const port =chrome.runtime.connect({name: "background"});

console.log("Ejecutando content script plaza vea Frutas y Verduras version 2.0");




function delay(time){
    return new Promise (resolve=>setTimeout(resolve,time));
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.cmd ==="scrap"){
           const products=  scrappingProducts()
            port.postMessage({cmd:"finish-scrap",products});
           // sendResponse({products});
           
        }
    } 

);

function scrappingProducts() {
      let cards = document.querySelectorAll("div.showcase-grid>div>.Showcase__content");
    cards= [...cards]
    const products = cards.map(x=>{
    const name = x.querySelector("button.Showcase__name")?.textContent
    const sellerName = x.querySelector(".Showcase__SellerName")?.textContent;
    const salePrice = x.querySelector("div.Showcase__salePrice")?.textContent
    return {name,sellerName,salePrice}
})
console.log(products)
return products
}

port.onMessage.addListener(function(msg){

});
