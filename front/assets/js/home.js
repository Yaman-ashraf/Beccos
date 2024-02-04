
const getHomeCategories = async()=>{

    const {data} =await  axios.get(`${ApiURL}/categories/active`);
    return data.categories;
}

const displayHomeCategories = async () => {
    const categories = await getHomeCategories();
    const result = categories
        .map((category) => `
            <div class="swiper-slide category">
               <a href="products.html?productsByCategory=${category._id}" > ${category.name}</a>
            </div>
        `)
        .join('');

    document.querySelector(".categories .swiper-wrapper").innerHTML = result;

    const categorySwiper = new Swiper('.categories-swiper', {
        // Optional parameters
        direction: 'horizontal',
       //loop: true,
        //autoplay: true,
        slidesPerView: 4.5,
        spaceBetween:20,
        loop:true,
        autoplay:true,
        // If we need pagination
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1.5,
              spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 3.5,
              spaceBetween: 30
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 4.5,
              spaceBetween: 40
            }
          },


        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
}
displayHomeCategories();
const getSliders = async()=>{

    const {data} =await  axios.get(`${ApiURL}/sliders/active`);
    return data.sliders;
}

const displaySliders = async ()=>{

    const sliders = await getSliders();
    const result =sliders.map( (slider)=>
        `  <div class="swiper-slide">
        <a href="${slider.link}">
        <img src=${slider.image.secure_url} />
        </a>
      </div>
     `
    ).join("");

    document.querySelector(".header .swiper-wrapper").innerHTML=result;

    const sliderSwiper = new Swiper('.header .swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        autoplay:true,
        slidesPerView:1,


        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
          clickable:true,
        },


        // And if we need scrollbar
        scrollbar: {
          el: '.swiper-scrollbar',
        },
      });
}
displaySliders();


  const getHomeProducts = async()=>{
    const {data} = await axios.get(`${ApiURL}/products/active?limit=4`);
    return data.products;
  }
  const displayHomeProducts = async()=>{
    const products = await getHomeProducts();
    const result = products.map( (product)=>
    `
    <div class="col-md-4 col-lg-3 col-sm-6 ">
    <div class="product">
    <a href="product.html?id=${product._id}">
    <h3>
    ${product.name}

    </h3>
    <div class='productImg'>
    <img src=${product.image.secure_url} class="img-fluid" />
    </div>
    <div class="product-footer">
        <div class="price">
        <span class="first-price">$${product.price}</span>
        <span class="final-price">$${product.finalPrice}</span>

        </div>
        <img src="assets/img/product/Icons.svg" />
    </div>
    </div>
    </a>
    </div>
</div>

    `
    ).join('');
    document.querySelector(".products .row").innerHTML=result
  }

  const getHomeBrands =async ()=>{
    const {data} = await axios.get(`${ApiURL}/brand`);
    return data.brands;
  }
  const displayHomeBrands = async()=>{
    const brands = await getHomeBrands();


    const result = brands.map( (brand)=> `<div class="swiper-slide brand">
    <a href="products.html?productsByBrand=${brand._id}" >
    <img src="${brand.image.secure_url}"></a>
 </div>`
    )
    .join('');

    document.querySelector(".brands .swiper-wrapper ").innerHTML=result;

    const BrandSwiper = new Swiper('.brands-swiper', {
        // Optional parameters
        direction: 'horizontal',
       //loop: true,
        //autoplay: true,
        slidesPerView: 4.5,
        spaceBetween:20,
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
          },

          breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1.5,
              spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 3.5,
              spaceBetween: 30
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 4.5,
              spaceBetween: 40
            }
          },


        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
  }
  displayHomeBrands();
  displayHomeProducts();

  const getReviews = async()=>{

    const {data} = await axios.get(`${ApiURL}/reviews`);
    return data.reviews;
  }

  const displayReviews = async()=>{

    const reviews = await getReviews();
    const result = reviews.map( (review)=>
    `
    <div class="swiper-slide testimonial">

    <div class="col-lg-4">
        <div class="testimonial">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
            <g clip-path="url(#clip0_1_3222)">
                <path
                    d="M44 23.3543L33.328 23.3543C33.5104 15.5765 35.7164 14.6936 38.4871 14.4416L39.5556 14.3092L39.5556 5.75672L38.324 5.82272C34.706 6.02627 30.706 6.67849 28.0373 9.97294C25.698 12.8609 24.6667 17.5792 24.6667 24.822L24.6667 38.2432L44 38.2432L44 23.3543Z"
                    fill="#01B5B2" />
                <path
                    d="M19.3335 38.2432L19.3335 23.3543L8.80394 23.3543C8.98639 15.5765 11.1211 14.6936 13.8917 14.4416L14.8891 14.3092L14.8891 5.75674L13.7286 5.82274C10.1106 6.02629 6.07483 6.67851 3.40616 9.97295C1.06705 12.861 0.000162024 17.5792 0.000161391 24.8221L0.000160217 38.2432L19.3335 38.2432Z"
                    fill="#01B5B2" />
            </g>
            <defs>
                <clipPath id="clip0_1_3222">
                    <rect width="44" height="44" fill="white"
                        transform="translate(44 44) rotate(-180)" />
                </clipPath>
            </defs>
        </svg>
        <p>${review.comment}.</p>
        <div class="user-data">
            <div class="user-info">
                <h3>${review.userId.name}</h3>
            </div>
        </div>
        </div>
    </div>
    </div>
        `
     ).join('');

     document.querySelector(".testimonials .swiper-wrapper").innerHTML=result;

     const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        // Optional parameters
        direction: 'horizontal',
       //loop: true,
        //autoplay: true,
        slidesPerView: 4.5,
        spaceBetween:20,
        loop:true,
        autoplay:true,
        // If we need pagination
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1.5,
              spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 3.5,
              spaceBetween: 30
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 4.5,
              spaceBetween: 40
            }
          },


        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
  }
  displayReviews();
