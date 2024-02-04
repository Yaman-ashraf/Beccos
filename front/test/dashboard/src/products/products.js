const ApiURL = 'https://beccos.onrender.com';

const createProductForm = document.querySelector("#creactProductForm");

createProductForm?.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log(e);

  const name = document.querySelector("#name").value;
  const stock = document.querySelector("#stock").value;
  const price = document.querySelector("#price").value;
  const discount = document.querySelector("#discount").value;
  const description = document.querySelector("#description").value;
  const image = document.querySelector("#image").files[0];
  const subImages = document.querySelector("#subImages");
  const categoryId = document.querySelector("#categoryId").value;

  const formData = new FormData();

  formData.append("name", name);
  formData.append("stock", stock);
  formData.append("price", price);
  formData.append("discount", discount);
  formData.append("description", description);
  formData.append("image", image);
  formData.append("categoryId", categoryId);
  for (let i = 0; i < subImages.files.length; i++) {
    formData.append("subImages", subImages.files[i]);
  }
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `https://beccos.onrender.com/products`,
    formData,
    { headers: { authorization: `BECCOS__${token}` } }
  );
  if (data.message == "success") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "تم اضافة المنتج بنجاح",
      // })
    });
  }
});
const getCategories = async () => {
  const { data } = await axios.get(`https://beccos.onrender.com/categories`);
  return data.categoies;
};
const displayCategories = async () => {
  let result = ``;
  const categories = await getCategories();
  const categoriesSelect = document.querySelector("#categoryId");
  categories.map((category) => {
    result += `<option value=${category._id}>${category.name}</option>`;
  });

  categoriesSelect.innerHTML = result;
};

displayCategories();

const getProducts = async (page) => {
  const { data } = await axios.get(
    `https://beccos.onrender.com/products?page=${page}`
  );
  return data;
};
const displayProducts = async (page = 1) => {
  const data = await getProducts(page);
  const products = data.products;
  const result = products
    .map(
      (product) =>
        `<tr>
    <td>${product.name}</td>
    <td><img src="${product.image.secure_url}" width="50px"/></td>
    <td><span class="badge badge-${
      product.status == "Active" ? "success" : "danger"
    }">${product.status}</span></td>
    <td>
    <a href="#" onClick="deleteCategory('${
      product._id
    }',event)" class='btn btn-danger'>

    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg>    </a>
    </td>
    </tr>`
    )
    .join("");
  document.querySelector("#products").innerHTML = result;
  const numberOfPages = data.total / data.count;
  pagination(numberOfPages, page);
};
const deleteCategory = async (id, e) => {
  const token = localStorage.getItem("token");
  console.log(token);
  const { data } = await axios.delete(`${ApiURL}/categories/${id}`, {
    headers: { authorization: `BECCOS__${token}` },
  });
  if (data.message == "success") {
    e.target.parentElement.parentElement.style = "display:none";
  }
};

function pagination(numberOfPages, page) {
  let paginationLinks = ``;
  if (page === 1) {
    paginationLinks += `<a  href="#" class="page disabled" >&lt;</a>`;
  } else {
    paginationLinks += `<a  href="#" class="page" onclick="displayProducts(${
      page - 1
    })">&lt;</a>`;
  }
  for (let i = 0; i < numberOfPages; i++) {
    paginationLinks += `
      <a href="#" class="page" onclick="displayProducts(${i + 1})">${i + 1}</a>
      `;
  }

  if (page === numberOfPages) {
    paginationLinks += `<a  href="#" class="page disabled">&gt;</a>`;
  } else {
    paginationLinks += `<a href="#" class="page" onclick="displayProducts(${
      page + 1
    })">&gt;</a>`;
  }
  document.querySelector(".pagination").innerHTML = paginationLinks;
}

displayProducts();
