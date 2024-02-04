const loginForm = document.querySelector(".loginForm");
loginForm?.addEventListener("submit",function(e){
    e.preventDefault();
    login(e);
})
const login = async(e)=>{
    const elements = e.target.elements;
    const email = elements["email"].value;
    const password = elements["password"].value;
    try{
        const {data} = await axios.post(`https://beccos.onrender.com/auth/signin`,{email,password});
        if(data.message=='success'){
            localStorage.setItem("adminToken",data.token);
            location.href='./../../src/home/index.html';
        }
    }catch(error){
            document.querySelector(".invalid").classList.remove('invalid');
    }
}

const checkAdmin = async()=>{
    const token = localStorage.getItem("adminToken");
    if(!token){
        location.href='./../../src/auth/login.html';
    }
}


