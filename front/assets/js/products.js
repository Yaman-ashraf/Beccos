const sortBtn = document.querySelector(".sortSubmit");

const getProductsSort = async (e) => {
    e.preventDefault();
    const value = e.target.elements[0].value;
    displayProducts(page = 1, `sort=${value}`);
}

sortBtn.onsubmit = getProductsSort;

const getProducts = async (page, params) => {
    document.querySelector(".loader-container").classList.remove('d-none');
    const { data } = await axios.get(`${ApiURL}/products/active?page=${page}&limit=9&${params}`);
    return data;
}

const displayProducts = async (page = 1, params = '') => {
    const data = await getProducts(page, params);
    const products = data.products;
    let result = '';

    console.log(products.length);
    if (products.length == 0) {
        document.querySelector(".loader-container").classList.add('d-none');
    }

    if (products.length != 0) {
        result = products.map((product) =>
            `
        <div class="col-lg-4 col-md-12">
            <a href="product.html?id=${product._id}">
                <div class="product">
                    <h3>${product.name.substring(0, 10)}</h3>
                    <img src="${product.image.secure_url}" class="img-fluid"  />
                    <div class="product-footer">
                        <div class="rating">
                            ${generateRatingStars(product.avgRating)}
                        </div>
                        <div class="price">
                            <span class="first-price ">${product.price}</span>
                            <span class="final-price">${product.finalPrice}</span>
                        </div>
                        <img src="assets/img/product/Icons.svg" />
                    </div>
                </div>
            </a>
        </div>
    `).join('');
    }
    document.querySelector(".products-items").innerHTML = result;

    const numberOfPage = Math.ceil(data.total / data.count);

    let paginationLinks = '';
    if (page === 1) {
        paginationLinks = `<li class="page-item disabled" >
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;
    } else {
        paginationLinks = `<li class="page-item" onClick="displayProducts(${page - 1}, '${params}')">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;
    }
    for (let i = 0; i < numberOfPage; i++) {
        paginationLinks += `<li class="page-item"><a class="page-link" href="#" data-page=${i + 1} onClick="displayProducts(${i + 1}, '${params}')">${i + 1}</a></li>`;
    }

    if (numberOfPage === page) {
        paginationLinks += `<li class="page-item disabled">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
    } else {
        paginationLinks += `<li class="page-item" onClick="displayProducts(${page + 1}, '${params}')">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
    }

    document.querySelector(".loader-container").classList.add('d-none');
    document.querySelector(".pagination").innerHTML = paginationLinks;
}

(async function () {
    const searchParams = new URLSearchParams(window.location.search);
    const productsByCategory = searchParams.get('productsByCategory');
    const productsByBrand = searchParams.get('productsByBrand');

    if (productsByCategory) {
        displayProducts(page = 1, `categoryId=${productsByCategory}`);
    } else if (productsByBrand) {
        console.log(productsByBrand);
        displayProducts(page = 1, `brandId=${productsByBrand}`);
    } else {
        displayProducts();
    }
})();

const getCategories = async () => {
    const { data } = await axios.get(`${ApiURL}/categories/active`);
    return data;
}

const displayCategories = async () => {
    const categoriesData = await getCategories();
    const categories = categoriesData.categories;

    const result = categories.map((category) =>
        `
        <li>
            <input type="radio" id="${category._id}" name="category" value="${category._id}" class="form-check-input">
            <label for="${category._id}">${category.name}</label>
        </li>
    `).join('');

    document.querySelector(".product-filter ul.categories").innerHTML = result;
}

displayCategories();

const getBrands = async () => {
    const { data } = await axios.get(`${ApiURL}/brand`);
    return data;
}

const displayBrands = async () => {
    const brandsData = await getBrands();
    const brands = brandsData.brands;

    const result = brands.map((brand) =>
        `
        <li>
            <input type="radio" id="${brand._id}" name="brand" value="${brand._id}" class="form-check-input">
            <label for="${brand._id}">${brand.name}</label>
        </li>
    `).join('');

    document.querySelector(".product-filter ul.brands").innerHTML = result;
}

displayBrands();

const categoryForm = document.querySelector(".submitCategory");
const brandForm = document.querySelector(".submitBrand");

const getProductsByCategory = async (e) => {
    e.preventDefault();
    const categoryId = document.querySelector('input[name="category"]:checked').value;
    console.log(categoryId);
    displayProducts(page = 1, `categoryId=${categoryId}`);
}

const getProductsByBrand = async (e) => {
    e.preventDefault();
    const brandId = document.querySelector('input[name="brand"]:checked').value;
    console.log(brandId);
    displayProducts(page = 1, `brandId=${brandId}`);
}

categoryForm.onsubmit = getProductsByCategory;
brandForm.onsubmit = getProductsByBrand;

const getPriceFilter = async (e) => {
    e.preventDefault();
    const priceType = document.querySelector('input[name="priceType"]:checked').value;
    let priceFilter = '';

    switch (priceType) {
        case 'range':
            const minRange = document.getElementById('minPrice').value;
            const maxRange = document.getElementById('maxPrice').value;
            priceFilter = `finalPrice[lt]=${maxRange}&finalPrice[gt]=${minRange}`;
            break;
        case 'lt':
            const maxPriceLT = document.getElementById('maxPriceLT').value;
            priceFilter = `finalPrice[lt]=${maxPriceLT}`;
            break;
        case 'gt':
            const minPriceGT = document.getElementById('minPriceGT').value;
            priceFilter = `finalPrice[gt]=${minPriceGT}`;
            break;
        case 'lte':
            const maxPriceLTE = document.getElementById('maxPriceLTE').value;
            priceFilter = `finalPrice[lte]=${maxPriceLTE}`;
            break;
        case 'gte':
            const minPriceGTE = document.getElementById('minPriceGTE').value;
            priceFilter = `finalPrice[gte]=${minPriceGTE}`;
            break;
        default:
            break;
    }

    console.log(priceFilter);
    displayProducts(page = 1, priceFilter);
}

const priceSubmitForm = document.querySelector(".priceSubmit");
priceSubmitForm.onsubmit = getPriceFilter;

function generateRatingStars(avgRating) {
    let starsHtml = '<div class="stars">';
    if (avgRating > 0) {
        for (let i = 1; i <= avgRating; i++) {
            starsHtml += `<img src="assets/img/public/start.svg"  />`;
        }
    } else {
        starsHtml += `<span>No ratings yet</span>`;
    }
    starsHtml += `</div>`;
    return starsHtml;
}
