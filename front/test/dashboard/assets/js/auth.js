const loginClick = document.querySelector("#loginClick");
loginClick.addEventListener("click",function(e){
    e.preventDefault();
    login();
})

const login = async()=>{
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try{
        const {data} = await axios.post(`https://beccos.onrender.com/auth/signin`,{email,password});

        if(data.message=='success'){
            localStorage.setItem("token",data.token);
            location.href='../../src/categories/index.html'
        }
    }catch(error){
        document.querySelector(".invalid").classList.remove("invalid");
    }

}
