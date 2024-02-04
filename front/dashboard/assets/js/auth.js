let url = `https://library-seven-beta.vercel.app/`;

const loginClick = document.querySelector("#loginClick");
loginClick.addEventListener("click",function(e){
    e.preventDefault();
    login();
})


async function login(){
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const {data} = await axios.post(`${url}auth/login`,{email,password}).catch(
        (error)=>{

         document.querySelector("#invalidLogin").classList.remove('d-none');
        document.querySelector("#invalidLogin").classList.add('block');

    } );


    if(data.message=='success'){
        localStorage.setItem("token",data.token);


        location.href='../categories/index.html';
    }

}
