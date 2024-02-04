document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('defaultOpen').click();
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.add('hideTab');
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.remove('hideTab');
    evt.currentTarget.classList.add("active");
}

const getUserWithToken = async()=>{
    const token = localStorage.getItem("userToken");
    const {data} = await axios.get(`${ApiURL}/user/getUserData`,{
        headers:{authorization:`BECCOS__${token}`}
    });

    return data.user;
}

const displayUserData = async()=>{

    const user = await getUserWithToken();
    document.querySelector('.profile-info').innerHTML =`
    <h1>User Profile</h1>
    <p class="userName"><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong>  ${user.email}</p>
    <p><strong>Country:</strong> ${user.address?user.address:'not inserted'}</p>
    `;

    document.querySelector("#newName").value = user.name
    document.querySelector("#newEmail").value = user.email
    document.querySelector("#newPhone").value = user.phone??''
    document.querySelector("#newCity").value = user.address??''
    document.querySelector("#userId").value = user._id;
}
displayUserData();

const updateUserForm = document.querySelector(".updateUserForm");
updateUserForm.onsubmit = async function(e){
    e.preventDefault();
    const userId = document.querySelector("#userId").value;
    console.log(userId);
    const elements = e.target.elements;
    const name = elements['name'].value;
    const email = elements['email'].value;
    const phone = elements['phone'].value;
    const address = elements['city'].value;
    const token = localStorage.getItem('userToken');
    const {data} = await axios.patch(`${ApiURL}/user/${userId}`,{name,
        email,
        phone,
        address},
        {
            headers:{authorization:`BECCOS__${token}`}
        })

        if(data.message=='success'){
            showToast({msg:'data updated succesfully'});
            setTimeout( ()=>{
                location.href='profile.html'
            },3000 )
        }
}

const getOrders = async()=>{
    const token = localStorage.getItem('userToken');
    const {data} = await axios.get(`${ApiURL}/order`,
    {
        headers:{authorization:`BECCOS__${token}`}
    })
    return data;
}

const displayOrders = async()=>{
    const data = await getOrders();
    const result = data.orders.map( order=>
        `
        <tr>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td>${order.finalPrice + order.shipping}</td>
            <td>${order.status}</td>
            <td>
            ${order.status === 'pending' ?
              `
              <form >
                <input type='text' name='note' class="note" placeholder="note" />

                <button onclick=cancelOrder(event,'${order._id}') class="cancelButton " >cancel</button>
              </form>
              ` :
              'not allow'}
          </td>       </tr>
        `
        );

        document.querySelector(".showOrders").innerHTML = result
}

const cancelOrder = async(e,id)=> {
    console.log(e);
    console.log(id);

    e.preventDefault();
    const note = document.querySelector(".note").value;
    const token = localStorage.getItem('userToken');
    const {data} = await axios.patch(`${ApiURL}/order/cancel/${id}`,{note},
    {
        headers:{authorization:`BECCOS__${token}`}
    });

    if(data.message=='success'){
        showToast({msg:'order canceled successfully'});
        setTimeout( ()=>{
            location.href='profile.html'
        },3000 )
    }

}


displayOrders();
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
