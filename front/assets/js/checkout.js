const getCart = async () => {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.get(`${ApiURL}/cart`, { headers: { authorization: `BECCOS__${token}` } });
    return data;
}

const displayOrderProducts = async () => {
    document.querySelector(".loader-container").classList.remove('d-none');

    const data = await getCart();
    const products = data.products;
    const result = products.map((product) => `
    <li>
        <img src="${product.details.image.secure_url}" alt="Product Name">
        <div class="product-details">
            <h4>${product.details.name}</h4>
            <p>Price: $${product.details.finalPrice}</p>
            <p>Quantity: ${product.quantity}</p>
        </div>
    </li>
    ` ).join('');
    const params = new URLSearchParams(window.location.search);
    const shippingCost = params.get('delevary');
    const orderTotal = params.get('total');

    document.querySelector(".shippingCost").textContent = shippingCost;
    document.querySelector(".orderTotal").textContent=orderTotal;
    document.querySelector(".orderProducts").innerHTML=result;
    const user = await getUserData();

    document.querySelector("#phone").value=user.phone??'';
    document.querySelector("#address").value=user.address??'';
    document.querySelector("#delevary").value=shippingCost;


}


const confirmPayment = document.querySelector(".confirmPayment");

confirmPayment.onsubmit = async function(e){
    document.querySelector(".loader-container").classList.remove('d-none');

    e.preventDefault();
    try{

    const elements = e.target.elements;
    const phone = elements['phone'].value;
    const address = elements['address'].value;
    const shipping = elements['delevary'].value;
    const token = localStorage.getItem("userToken");

    const {data} = await axios.post(`https://beccos.vercel.app/order`,
    {
        phone,address,shipping
    },
    {
        headers:{authorization:`BECCOS__${token}`}
    }
    );

    if(data.message=='success'){
        showToast({msg:'order added succefully , plz wait to approve'});
        document.querySelector(".loader-container").classList.add('d-none');

        setTimeout(() => {
            location.href='index.html'
        }, 3000);
    }
}catch(error){

    if(error.response){
        document.querySelector(".loader-container").classList.add('d-none');

        showToast({msg:error.response.data.message,position:'center',showConfirmButton:true,icon:'error'});

    }else{
        document.querySelector(".loader-container").classList.add('d-none');

        showToast({msg:'plz add phone and address',position:'center',showConfirmButton:true,icon:'error'});

    }
}

}

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
