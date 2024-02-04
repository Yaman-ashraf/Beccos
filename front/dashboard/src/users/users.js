const runDataTable = () => {
  $("#categoryTable").DataTable().destroy();

  $(function () {
    $("#categoryTable").DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      //  "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
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

const createAdminForm = document.querySelector(".createAdminForm");
const editUserForm = document.querySelector(".editUserForm");

createAdminForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  createAdmin(e);
});
editUserForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  updateUser(e);
});

const getUsers = async () => {
  const token = localStorage.getItem("adminToken");
  const { data } = await axios.get(`https://beccos.onrender.com/user`, {
    headers: { authorization: `BECCOS__${token}` },
  });

  return data.users;
};
const getUser = async (id) => {
  const { data } = await axios.get(`https://beccos.onrender.com/user/${id}`);
  return data.user;
};

const displayUsers = async () => {
  const users = await getUsers();
  const result = users
    .map(
      (ele) => `
        <tr>
        <td>${ele.name}</td>
        <td>${ele.email}</td>
        <td>${ele.phone}</td>
        <td>${ele.role}</td>
        <td>${ele.status}</td>
        <td class="d-flex align-items-center justify-content-center" style="column-gap:14px">

        <a href="./edit.html?id=${ele._id}">
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#f0ad4e" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>

        </a>
        </td>

        </tr>
        `
    )
    .join("");
  document.querySelector(".users").innerHTML = result;
  runDataTable();
};
const createAdmin = async (e) => {
  const elements = e.target.elements;
  const user = {
    name:elements['name'].value,
    email:elements['email'].value,
    password:elements['password'].value,
    role:'Admin',
  }

  const token = localStorage.getItem("adminToken");
  try {
    const { data } = await axios.post(
      `https://beccos.onrender.com/auth/signup`,
      user,
      { headers: { authorization: `BECCOS__${token}` } }
    );

    if (data.message == "success") {
      location.href = "./index.html";
    }
  } catch (error) {}
};
const updateUser = async (e) => {
    const elements = e.target.elements;

    const user = {
        email:elements['email'].value,
        name:elements['name'].value,
        status:elements['status'].value,
        role:elements['role'].value,
    };

    console.log(user);
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const token = localStorage.getItem("adminToken");
  try {
    const { data } = await axios.patch(
      `https://beccos.onrender.com/user/${id}`,
      user,
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
  const user = await getUser(id);
  document.getElementsByName("name")[0].value = user.name;
  document.getElementsByName("email")[0].value = user.email;
  const options = `<option value='Active' ${user.status=='Active'?'selected':''}>active</option>
                  <option value="Not_Active" ${user.status=='Not_Active'?'selected':''}>not active</option>`
    const roles = `<option value='User' ${user.role=='User'?'selected':''}>User</option>
    <option value="Admin" ${user.role=='Admin'?'selected':''}>Admin</option>`

  document.querySelector(".user-status").innerHTML=options;
  document.querySelector(".user-role").innerHTML=roles;


};


const getBrands = async () => {
  const { data } = await axios.get("https://beccos.onrender.com/brand");
  return data.brands;
};



