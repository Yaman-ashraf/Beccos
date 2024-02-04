let categories = [];
let url = `https://library-seven-beta.vercel.app/`;
let AdminData={};

if(localStorage.getItem("token") == null){
    location.href='../../src/auth/login.html';
}else{
    getLoginAdminData();

}

async function getLoginAdminData(){
    const token =localStorage.getItem("token");

    const {data} = await axios.get(`${url}user/admin`
    ,{headers: {Authorization:`Library__${token}`} });
    if(data.message=='success'){
        AdminData = data.user;
        adminName.innerHTML=AdminData.userName
    }
}
async function getCategories(){
    let {data} = await axios.get(`${url}category`);
    categories=data.category;
    displayCategory();
}
// }
function displayCategory(){
    let result = ``;
    result+=categories.map( (ele)=>{
        return `<tr  data-id='${ele._id}'>
        <td>
            <p class="mb-0">${ele.name}</p>
        </td>
        <td>
            <div class="media">
                <div class="avatar me-2">
                    <img alt="avatar" src="${ele.image.secure_url}" class="rounded-circle">
                </div>

            </div>
        </td>

        <td class="text-center">

            <span class="badge badge-light-${ele.status=='Active'?'success':'danger'}"  >${ele.status=='Active'?'فعال':'غير فعال'}</span>


         </td>

        <td class="text-center">

        <span class="badge badge-light-${ele.can_borrow==true?'success':'danger'}">${ele.can_borrow?'يمكن':'لا يمكن'}</span>
    </td>
        <td class="text-center">
            <div class="action-btns">
                <a href="javascript:void(0);" class="action-btn btn-view bs-tooltip me-2" data-toggle="tooltip" data-placement="top" title="" data-bs-original-title="View">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </a>
                <a href="edit.html?id=${ele._id}" class="action-btn btn-edit bs-tooltip me-2" data-toggle="tooltip" data-placement="top" title="" data-bs-original-title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </a>
                <a onclick="deleteCategory('${ele._id}')"
                class="action-btn btn-delete bs-tooltip " data-toggle="tooltip"
                data-placement="top" title="" data-bs-original-title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></a>
            </div>
        </td>
    </tr>`
    } )


    document.getElementById("categories").innerHTML=result;

}


async function createCategory(e){

    e.preventDefault();
    const name = document.querySelector("#name").value;
    const file = document.querySelector("#file").files[0];
    const formData = new FormData();
    formData.append('name',name);
    formData.append('mainImage',file);
    formData.append('createdBy',AdminData._id);
    formData.append('createdBy',AdminData._id);
    formData.append('updatedBy',AdminData._id);
   const {data} = await axios.post(`${url}category`,formData);

   if(data.message=='success'){

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'category added successfully'
      })
   }

   setTimeout( ()=>{
    location.href='index.html'
   },3000 )

   }

async function getCategory(){
    const url_array = document.URL.split('?id=');
    const id = url_array[1];
    const {data} = await axios.get(`${url}category/${id}`);
    const status = document.querySelector('#status');
    const can_borrow = document.querySelector('#can_borrow');
    if(data.message=='success'){
        const category = data.category;
        document.querySelector("#edit_name").value=category.name;
        document.querySelector("#old_image").src=category.image.secure_url;
        document.querySelector("#category_id").value=category._id;
        category.status=='Active'?status.children[0].setAttribute('selected','selected'):status.children[1].setAttribute('selected','selected')
        category.can_borrow==true?can_borrow.children[0].setAttribute('selected','selected'):can_borrow.children[1].setAttribute('selected','selected')


    }
}

async function updateCategory(e){
    e.preventDefault();
    const name = document.querySelector("#edit_name").value;
    const id = document.querySelector("#category_id").value;
    const status = document.querySelector("#status").value;
    const can_borrow = document.querySelector("#can_borrow").value;

    const formData = new FormData();


    if(document.querySelector("#file").files.length!=0){
        const file = document.querySelector("#file").files[0];
        formData.append('mainImage',file);
    }

    formData.append('name',name);
    formData.append('status',status);
    formData.append('can_borrow',can_borrow);
    formData.append('updatedBy',AdminData._id);

   const {data} = await axios.put(`${url}category/${id}`,formData);
   if(data.message=='success'){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'category updated successfully'
      })
   }

   setTimeout( ()=>{
    location.href='index.html'
   },3000 )



}

async function deleteCategory(id){

    let {data} = await axios.delete(`${url}category/${id}`);

    if(data.message=='success deleted '){
     let deletedCategory=document.querySelector(`[data-id="${id}"]`);
     deletedCategory.remove();
     const Toast = Swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timer: 3000,
         timerProgressBar: true,
         didOpen: (toast) => {
           toast.addEventListener('mouseenter', Swal.stopTimer)
           toast.addEventListener('mouseleave', Swal.resumeTimer)
         }
       })

       Toast.fire({
         icon: 'success',
         title: 'category deleted successfully'
       })
    }

 }




 getCategories();
