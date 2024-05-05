const axios = require("axios");
const Noty = require("noty");

let cartCounter = document.querySelector("#cartCounter");

let addtocart = document.querySelectorAll(".add-to-card");




function updateCart(pizza) {
    axios.post("/update-cart", pizza).then(res => {
        console.log(res);
        cartCounter.innerText = res.data.totalqty;

        new Noty({
            type:"success",
            timeout:1000,
            progressBar:false,
            text: "items added to cart"
        }).show();

    }).catch((err) => {
        new Noty({
            type:"error",
            timeout:1000,
            progressBar:false,
            text: "something went wrong"
        }).show();
    })

}




addtocart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza);
    })

}) 