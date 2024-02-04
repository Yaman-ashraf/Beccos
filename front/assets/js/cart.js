const getCart = async()=>{
    const token= localStorage.getItem('userToken');
    const {data} = await axios.get(`${ApiURL}/cart`,{headers:{authorization:`BECCOS__${token}`}});
    return data;
}

const displayCart= async()=>{
    const data = await getCart();

    const products =data.products;
    let subTotal = 0;
    const result = products.map( (product)=>{
        console.log(product);
    const productSubTotal = product.details.finalPrice * product.quantity;
    subTotal += productSubTotal;
    return `
    <div class="cart-row">
    <div class="product-info">
        <div class="product-description">
            <div class="product-img">
                <img src="${product.details.image.secure_url}" class="img-fluid" />
            </div>
            <div class="product-details">
                <h3>${product.details.name}</h3>
                <span>Color:<button style="background-color:#${product.color}"></button> </span>
                <span>Size:  ${product.size}</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width=24px
                  height=24px
                  viewBox="0 0 24 25"
                  fill="none"
                  onClick="removeFromCart(event,'${product.productId}')"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 5.79289C5.68342 5.40237 6.31658 5.40237 6.70711 5.79289L12 11.0858L17.2929 5.79289C17.6834 5.40237 18.3166 5.40237 18.7071 5.79289C19.0976 6.18342 19.0976 6.81658 18.7071 7.20711L13.4142 12.5L18.7071 17.7929C19.0976 18.1834 19.0976 18.8166 18.7071 19.2071C18.3166 19.5976 17.6834 19.5976 17.2929 19.2071L12 13.9142L6.70711 19.2071C6.31658 19.5976 5.68342 19.5976 5.29289 19.2071C4.90237 18.8166 4.90237 18.1834 5.29289 17.7929L10.5858 12.5L5.29289 7.20711C4.90237 6.81658 4.90237 6.18342 5.29289 5.79289Z"
                    fill="#6C7275"
                  />
                </svg>
            </div>
        </div>
    </div>

    <div class="product-price">
        <span id="productFinalPrice">$${product.details.finalPrice}</span>
    </div>
    <div class="product-quantity">
        <div class="qty">
            <button onClick="updateQuantity('${product.productId}','-')">-</button>
            <span class="productQty" id="productQty">${product.quantity}</span>
            <button onClick="updateQuantity('${product.productId}','+')">+</button>
        </div>
    </div>
    <div class="subtotal">
        <span id="productSubTotal">${product.details.finalPrice * product.quantity}</span>
    </div>

</div>
    `;

    }

    ).join('');
    document.querySelector(".cart-items").innerHTML += result + ` <div class="cart-row">
    <a href="index.html" class="continue-shopping">continue shopping</a>
    <button onClick="clearCart()" class="clear-cart">clear cart</button>
</div>`;

 document.querySelector(".subTotalResult").textContent="$"+subTotal



}

async function removeFromCart(e,productId){
    const token = localStorage.getItem('userToken');
    document.querySelector(".loader-container").classList.remove('d-none');
    try{


    console.log(productId);
    const {data} = await axios.patch(`${ApiURL}/cart/removeItem`,{productId:productId},{
        headers:{authorization:`BECCOS__${token}`}
    });
    console.log(data);

    if(data.message=='success'){
        showToast({msg:'تم ازالة المنتج من السلة'})
        document.querySelector(".loader-container").classList.add('d-none');
        e.target.closest('.cart-row').classList.add('d-none');
    }
}catch(error){
    showToast({msg:'حدث خطا',icon:'error'})
    document.querySelector(".loader-container").classList.add('d-none');


}
}

const updateQuantity = async (productId,options)=>{
    const productQty = document.querySelector("#productQty");

    document.querySelector(".loader-container").classList.remove('d-none');

    const token = localStorage.getItem('userToken');
    const {data} = await axios.patch(`${ApiURL}/cart/updateQuantity`,{
        productId,options
    },{
        headers:{authorization:`BECCOS__${token}`}
    })
    if(data.message=='success'){
        showToast({msg:'تم تعديل الكمية  نجاح'})
        document.querySelector(".loader-container").classList.add('d-none');
        location.href="cart.html";


   }
}

const clearCart = async()=>{
    document.querySelector(".loader-container").classList.remove('d-none');

    const token = localStorage.getItem('userToken');

    try{


    const {data} = await axios.patch(`${ApiURL}/cart/clearCart`,{},{
        headers:{authorization:`BECCOS__${token}`}
    });

    if(data.message=='success'){
        showToast({msg:'تم تفريغ السلة   '})
        document.querySelector(".loader-container").classList.add('d-none');
        const cartItems = document.querySelectorAll(".cart-row");
        for(let i=1;i<cartItems.length -1;i++)
        cartItems[i].classList.add('d-none');
        document.querySelector(".subTotalResult").textContent=0

    }
}catch(error){
    showToast({msg:'حدث خطا ما',icon:'error'})
    document.querySelector(".loader-container").classList.add('d-none');

}
}

const city = document.querySelector(".city");
city.addEventListener('change',function(e){
    const subTotalResult = document.querySelector(".subTotalResult").textContent.replace('$','');
    const result = Number(e.target.value) + Number(subTotalResult)
   document.querySelector(".totalResult").textContent =result ;

    document.querySelector(".checkout-last").innerHTML=`
    <a href="checkout.html?total=${result}&delevary=${e.target.value}" class="checkout">Proceed to chekcout</a>`

})
/*
city.onchange = function(e){
    console.log(e.target.value);

}
*/
displayCart();
async function showToast({msg,position='top-end',timer=3000,showConfirmButton=false,icon='success'}) {
    const Toast = Swal.mixin({
        toast: true,
        position: position,
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: showConfirmButton,
        timerProgressBar: true,
        timer:timer,
    })
    await Toast.fire({
        icon: icon,
        title: msg,
    })
}
