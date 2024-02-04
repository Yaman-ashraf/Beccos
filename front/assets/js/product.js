
const getProduct =async ()=>{
    document.querySelector(".loader-container").classList.remove('d-none');
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id'); // price_descending
    const {data} = await axios.get(`${ApiURL}/products/${id}`);
    return data.product;
}
const displayProduct = async () => {
    const product = await getProduct();
    let ratingHtml = '';
    const token = localStorage.getItem('userToken');

    if (product.avgRating >0) {
        for (let i = 1; i <= product.avgRating; i++) {
            ratingHtml += `<img src="assets/img/public/start.svg"  />`;
        }
    } else {
        ratingHtml = '<span>No reviews</span>';
    }
    let colors = '';
    if(product.colors[0]){
    const colorsString = product.colors[0];
     colors = colorsString.split(",");
}

    const result =
    `
   <div class='col-lg-4'>
    <div class="product-images">
        <div class="main-image">
            <img src="${product.image.secure_url}" class="img-fluid" />
        </div>
        <div class="sub-images">
            ${product.subImages.map((image) => `
            <img src=${image.secure_url} class="img-fluid" />
            `)}
        </div>
    </div>
    </div>
    <div class='col-lg-6'>
       <div class="product-details">
        <div class="product-description">
            <h1>${product.name}</h1>
            <p>${product.description}</p>
            <div class="price">
                <span class="first-price">$${product.price}</span>
                <span class="final-price">$${product.finalPrice}</span>
            </div>
            <div class="rating">
                ${ratingHtml}
            </div>
            <div class="availability">
    <span>Availability</span>
    ${product.stock > 0 ? `<p>Hurry up! only ${product.stock} product left in stock!</p><img src="assets/img/public/stock.svg" />` : 'Not available'}
</div>

        </div>
        <span class="divider"></span>

        <div class="product-options">
                ${colors?`
                <div class="product-color">
                <span>Color : </span>
                <div class="color-buttons">
                    ${colors.map(color => `<button style="--color:#${color}" onclick="selectColor('${color}', this)"></button>`).join('')}
                </div>
            </div>`:''}
            ${product.sizes.length?`
            <div class="product-size">
            <span>Size : </span>
            <div class="size-buttons">
            ${product.sizes.map(size => `<button onclick="selectSize('${size}', this)">${size}</button>`).join('')}
            </div>
        </div>
            `:''}


            <div class="action-buttons">

            ${token ? '<button onclick="addToCart(\'' + product._id + '\')">Add to cart</button>' : 'login to create cart'}
            </div>
            </div>
        </div>
    </div>
    `;
   document.querySelector(".product .row").innerHTML = result;
const reviewResult = product.reviews.map((review) => {
    const stars = [];
    for (let i = 0; i < review.rating; i++) {
      stars.push('<img src="assets/img/public/start.svg" />');
    }

    return `
      <div class="review">
        <div class="start-side">
            <h3>${review.userId.name}</h3>
            <div class="rating">
                ${stars.join('')} <!-- إضافة النجوم هنا -->
            </div>
            <p>${review.comment}</p>
            ${review.image ? `<img src="${review.image.secure_url}" alt="Review Image" class="review-image" />` : ''}

        </div>
        <div class="end-side">
            ${review.createdAt} <!-- تاريخ الاستعراض -->
        </div>
      </div>
    `;
  }).join('');
    document.querySelector(".reviews-box h2").insertAdjacentHTML('afterend', reviewResult);
    document.querySelector(".loader-container").classList.add('d-none');
    if(!token){
        document.querySelector('.createReview').innerHTML='login to add review';
    }
}
displayProduct();
async function addToCart(id) {
    document.querySelector(".loader-container").classList.remove('d-none');
    try {
        const token = localStorage.getItem('userToken');
        const dataToSend = {
            productId: id,
            color: (selectedColor ? selectedColor : ''),
            size: (selectedSize ? selectedSize : ''),
        };
        const { data } = await axios.post(`${ApiURL}/cart`, dataToSend, {
            headers: {
                authorization: `BECCOS__${token}`
            }
        });

        if (data.message == 'success') {
            showToast({ msg: 'product added to cart' });
            document.querySelector(".loader-container").classList.add('d-none');
        }
    } catch (error) {
        document.querySelector(".loader-container").classList.add('d-none');
        if (error.response) {
            showToast({ msg: error.response.data.message ,icon:'error'});
        } else {
            showToast({ msg: 'plz select color and size', position: 'center', showConfirmButton: true,icon:'error' });
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
let selectedColor;
let selectedSize;

window.selectColor = function(color, button) {
    // تجعل جميع الأزرار باللون الأصلي
    const buttons = document.querySelectorAll('.color-buttons button');
    buttons.forEach(btn => {
        btn.style.boxShadow = 'none'; // إزالة الحاشية من جميع الأزرار
    });
    // تحدد اللون المختار
    selectedColor = color;
    // تغيير لون الحاشية للزر المختار
    button.style.boxShadow = '0 0 0 4px black'; // إضافة حاشية سوداء حول الزر المختار
}

window.selectSize = function(size,button) {
    const buttons = document.querySelectorAll('.size-buttons button');
    buttons.forEach(btn => {
        btn.style.boxShadow = 'none'; // إزالة الحاشية من جميع الأزرار
    });
    selectedSize = size;
    button.style.boxShadow = '0 0 0 4px black'; // إضافة حاشية سوداء حول الزر المختار


}

const createReview = document.querySelector(".createReview");
const stars = document.querySelectorAll('.rating .star');
createReview.onsubmit = async function (e) {
    e.preventDefault();
    document.querySelector(".loader-container").classList.remove('d-none');

  const elements = e.target.elements;
  const formData = new FormData();
    const content = elements['content'].value;
    const rating = getSelectedRating();
    formData.append('comment',content);
    formData.append('rating',rating);
    formData.append("image", elements["image"].files[0]);

    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id'); // price_descending
    try{


    const token = localStorage.getItem('userToken');
        const {data} = await axios.post(`${ApiURL}/products/${id}/review`,formData,
    {
        headers:{authorization:`BECCOS__${token}`}
    })
    if(data.message=='success'){
        showToast({msg:"review added succesfully"});
    document.querySelector(".loader-container").classList.add('d-none');

        setTimeout(() => {
            location.href='index.html';
        }, 3000);
    }
}catch(error){
    document.querySelector(".loader-container").classList.add('d-none');

    showToast({msg:error.response.data.message,icon:'error'});

}
};
function getSelectedRating() {
    let selectedRating = 0;

    stars.forEach((star, index) => {
        if (star.classList.contains('selected')) {
            selectedRating = index + 1;
        }
    });

    return selectedRating;
}
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        resetStars();
        selectStars(index + 1);
    });
});
function resetStars() {
    stars.forEach((star, index) => {
        star.classList.remove('selected');
        restoreOriginalSVG(star);
    });
}
function selectStars(count) {
    for (let i = 0; i < count; i++) {
        stars[i].classList.add('selected');
        replaceSVG(stars[i]);
    }
}
function replaceSVG(star) {
    const originalSVG = star.innerHTML;
    const replacedSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#01b5b2" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>';
    star.innerHTML = replacedSVG;
    star.dataset.value = '0';  // Reset the data-value
}
function restoreOriginalSVG(star) {
    const originalSVG = '<svg data-value="' + (Array.from(stars).indexOf(star) + 1) + '" width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6133 17.8986L4.81492 21.718L6.33329 14.0484L0.613281 8.73931L8.35008 7.81862L11.6133 0.718018L14.8765 7.81862L22.6133 8.73931L16.8934 14.0484L18.4117 21.718L11.6133 17.8986ZM11.6133 15.6814L15.7065 17.9809L14.7923 13.3633L18.2362 10.1668L13.578 9.6124L11.6133 5.33726L9.64858 9.6124L4.9904 10.1668L8.4343 13.3633L7.52012 17.9809L11.6133 15.6814Z" fill="#01B5B2"/></svg>';
    star.innerHTML = originalSVG;
    star.dataset.value = String(Array.from(stars).indexOf(star) + 1);
}
