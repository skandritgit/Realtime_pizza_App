const axios = require("axios");
const Noty = require("noty");

import moment from 'moment'
import admin from '../../app/http/middleware/admin';



let cartCounter = document.querySelector("#cartCounter");

let addtocart = document.querySelectorAll(".add-to-card");




function updateCart(pizza) {

    axios.post("/update-cart", pizza).then(res => {

        cartCounter.innerText = res.data.totalqty;

        new Noty({
            type: "success",
            timeout: 1000,
            progressBar: false,
            text: "items added to cart"
        }).show();

    }).catch((err) => {
        new Noty({
            type: "error",
            timeout: 1000,
            progressBar: false,
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

const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}



function initAdmin(socket) {

    const ordertablebody = document.querySelector("#ordertablebody");
    console.log("hhhhhhhhhhhhhhh")
    let orders = []
    let markup

    axios.get("/admin/orders", {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then((res) => {

        orders = res.data;

        markup = generateMarkup(orders);
        ordertablebody.innerHTML = markup;

    }).catch((err) => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
            <p>${menuItem.item.name}-${menuItem.qty} pc</p>
            `

        }).join('')
    }





    function generateMarkup(orders) {
        return orders.map(order => {
            return `
           <tr>
           <td class="border px-4 py-2 text-green-900">
               <p>${order._id}</p>
               <div>${renderItems(order.items)}</div>
           </td>
           <td class="border px-4 py-2">${order.customerId.name}</td>
           <td class="border px-4 py-2">${order.address}</td>
           <td class="border px-4 py-2">
               <div class="inline-block relative w-64">
                   <form action="/admin/order/status" method="POST">
                       <input type="hidden" name="orderId" value="${order._id}">
                       <select name="status" onchange="this.form.submit()"
                           class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                           <option value="order_placed"
                               ${order.status === 'order_placed' ? 'selected' : ''}>
                               Placed</option>
                           <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>
                               Confirmed</option>
                           <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>
                               Prepared</option>
                           <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>
                               Delivered
                           </option>
                           <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>
                               Completed
                           </option>
                       </select>
                   </form>
                   <div
                       class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                       <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20">
                           <path
                               d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                       </svg>
                   </div>
               </div>
           </td>
           <td class="border px-4 py-2">
               ${moment(order.createdAt).format('hh:mm A')}
           </td>
       </tr>
   `
        }).join('')
    }
   socket.on('orderplaced',(data)=>{
    new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: "New Order"
    }).show();
    orders.unshift(data);
    ordertablebody.innerHTML=''
    ordertablebody.innerHTML=generateMarkup(orders);

   })
}






const hiddeninput = document.getElementById("hiddeninput");
let statues = document.querySelectorAll(".status_line");

let order = hiddeninput ? hiddeninput.value : null;



order = JSON.parse(order);


let time = document.createElement('small')

function updatestatus(order) {
    statues.forEach((status)=>{
        status.classList.remove('step-completed');
        status.classList.remove('current');
    })

    let stepCompleted = true;
    statues.forEach((status) => {
        let dataProp = status.dataset.status

        if (stepCompleted) {
            status.classList.add("step-completed");
        }

        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');

            status.appendChild(time);
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add("current")

            }

        }
    })



}

// updatestatus(order);


//Socket

let socket =io();



if(order){
//join
socket.emit('join',`order_${order._id}`)

}

let adminAreaPath=window.location.pathname;
console.log(adminAreaPath);

if(adminAreaPath.includes('admin')){
    initAdmin(socket);
    socket.emit('join', 'adminRoom');
}



socket.on('orderupdated',(data)=>{
    const updatedOrder={...order}
    updatedOrder.updatedAt=moment().format()
    updatedOrder.status=data.status
    updatestatus(updatedOrder);
    new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: "Order Updated"
    }).show();
   
})

