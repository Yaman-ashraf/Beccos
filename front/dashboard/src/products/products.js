const runDataTable = () => {
  $("#categoryTable").DataTable().destroy();

  $(function () {
    $("#categoryTable").DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
       //"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
      buttons: ["colvis"],

      dom: "Bfrtip", // يحدد مكان ظهور الأزرار
      pagingType: "full_numbers",
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      responsive: true,
    });
  });
};

const createProductForm = document.querySelector(".createProductForm");
const editProductForm = document.querySelector(".editProductForm");
const createProductExcel = document.querySelector(".createProductExcel");
createProductForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  createProduct(e);
});
editProductForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  updateProduct(e);
});
createProductExcel?.addEventListener("submit", function (e) {
    e.preventDefault();
    createProductWithExcel(e);
  });
const getProducts = async () => {
  const token = localStorage.getItem("adminToken");
  const { data } = await axios.get(`https://beccos.vercel.app/products`, {
    headers: { authorization: `BECCOS__${token}` },
  });

  return data.products;
};
const getProduct = async (id) => {
  const { data } = await axios.get(`https://beccos.vercel.app/products/${id}`);
  return data.product;
};

const displayProducts = async () => {
  const products = await getProducts();
  const result = products
    .map(
      (ele) => `
        <tr>
        <td><img src=${ele.image.secure_url} width="100px" /></td>
        <td>${ele.name}</td>
        <td>${ele.stock}</td>
        <td>${ele.price}</td>
        <td>${ele.discount}</td>
        <td>${ele.finalPrice}</td>


        <td class="d-flex align-items-center justify-content-center" style="column-gap:14px">
        <svg onclick="deleteProduct('${ele._id}',event)" xmlns="http://www.w3.org/2000/svg" height="20" width="17.5"
        viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ff0000" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>

        <a href="./edit.html?id=${ele._id}">
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#f0ad4e" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>

        </a>
        </td>

        </tr>
        `
    )
    .join("");
  document.querySelector(".products").innerHTML = result;
  runDataTable();
};
const createProduct = async (e) => {
  const elements = e.target.elements;
  const subImages = e.target.elements["subImages"];
  const colorElements =  e.target.elements['colors'];
  const colorsString = colorElements.value;
  const colors = colorsString.split(',');
  const checkboxes = document.querySelectorAll('input[name="sizes[]"]:checked');
  const selectedSizes = [];
  const formData = new FormData();

  checkboxes.forEach(checkbox => {
    selectedSizes.push(checkbox.value);
});








  formData.append("name", elements["name"].value);
  formData.append("description", elements["description"].value);
  formData.append("price", elements["price"].value);
  formData.append("discount", elements["discount"].value);
  formData.append("stock", elements["stock"].value);
  formData.append("categoryId", elements["categoryId"].value);
  formData.append("brandId", elements["brandId"].value);
  formData.append("image", elements["image"].files[0]);
  formData.append("colors", colors);



  for (let i = 0; i < subImages.files.length; i++) {
    formData.append("subImages", subImages.files[i]);
  }

  selectedSizes.forEach(checkbox => {
    formData.append('sizes', checkbox);
});




  const token = localStorage.getItem("adminToken");
  console.log(token);
  try {
    const { data } = await axios.post(`https://beccos.vercel.app/products`,
      formData,
      { headers: { authorization: `BECCOS__${token}` } }
    );

    if (data.message == "success") {
      location.href = "./index.html";
    }
  } catch (error) {
    console.log(error);
  }
};

const createProductWithExcel= async(e)=>{
    const elements = e.target.elements;
    const formData = new FormData();
    const token = localStorage.getItem("adminToken");
    formData.append("file", elements["file"].files[0]);

    const {data} = await axios.post(`https://beccos.vercel.app/products/createWithExcel`,formData,{
        headers:{authorization:`BECCOS__${token}`}
    })

    if (data.message == "success") {
        location.href = "./index.html";
      }

}
const updateProduct = async (e) => {
    const elements = e.target.elements;
  const subImages = e.target.elements["subImages"];

  const formData = new FormData();
  formData.append("name", elements["name"].value);
  formData.append("description", elements["description"].value);
  formData.append("price", elements["price"].value);
  formData.append("discount", elements["discount"].value);
  formData.append("stock", elements["stock"].value);
  formData.append("categoryId", elements["categoryId"].value);
  formData.append("brandId", elements["brandId"].value);
  formData.append("image", elements["image"].files[0]);
  for (let i = 0; i < subImages.files.length; i++) {
    formData.append("subImages", subImages.files[i]);
  }
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const token = localStorage.getItem("adminToken");
  try {
    const { data } = await axios.put(
      `https://beccos.vercel.app/products/${id}`,
     formData,
      { headers: { authorization: `BECCOS__${token}` } }
    );

    if (data.message == "success") {
      location.href = "./index.html";
    }
  } catch (error) {}
};
const editItem = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const product = await getProduct(id);
  document.getElementsByName("name")[0].value = product.name;
  document.getElementsByName("description")[0].value = product.description;
  document.getElementsByName("price")[0].value = product.price;
  document.getElementsByName("discount")[0].value = product.discount;
  document.getElementsByName("stock")[0].value = product.stock;
  displayCategories(product.categoryId._id);
  displayBrands(product.brandId);
};

const deleteProduct = async (id, e) => {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.delete(
          `https://beccos.vercel.app/products/${id}`,
          {
            headers: { authorization: `BECCOS__${token}` },
          }
        );
        if (data.message == "success") {
          e.target.closest("tr").classList.add("d-none");
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

const getCategories = async () => {
  const { data } = await axios.get("https://beccos.vercel.app/categories");
  return data.categories;
};
const getBrands = async () => {
  const { data } = await axios.get("https://beccos.vercel.app/brand");
  return data.brands;
};

const displayCategories = async (id) => {
  try {
    const categories = await getCategories();
    const result = categories
      .map(
        (category) =>
          `<option value=${category._id} ${
            category._id == id ? "selected" : ""
          }>${category.name}</option>`
      )
      .join("");
    document.querySelector(".categories").innerHTML = result;
  } catch (error) {
    console.error("Error displaying categories:", error);
  }
};

const displayBrands = async (id) => {
  console.log(id);
  const brands = await getBrands();
  const result = brands
    .map(
      (brand) =>
        `<option value=${brand._id} ${brand._id == id ? "selected" : ""}>${
          brand.name
        }</option>`
    )
    .join("");

  document.querySelector(".brands").innerHTML = result;
};
