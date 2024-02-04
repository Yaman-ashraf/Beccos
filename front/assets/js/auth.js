const ApiURL = 'https://beccos.onrender.com';

(function () {
    const urlPrams = new URLSearchParams(window.location.search);
    const register = urlPrams.get('register');
    if (register) {
        showToast({
            msg: "email created successfully,plz confirm your email",
            position: 'center',
            showConfirmButton: true,
            timer: null
        });
    }
}());
const getUserData = async () => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.get(`${ApiURL}/user/getUserData`, {
        headers: { authorization: `BECCOS__${token}` }
    });

    return data.user;
}
const checkUser = async () => {
    document.querySelector(".loader-container").classList.remove('d-none');

    const token = localStorage.getItem("userToken");
    if (token) {
        const user = await getUserData();
        console.log(user);
        document.querySelector(".auth-buttons").classList.add("hide-auth");
        document.querySelector(".after-auth-buttons").classList.remove("hide-auth");
        document.querySelector(".after-auth-buttons span").textContent = user.name;
    }
    document.querySelector(".loader-container").classList.add('d-none');

}

checkUser();

const registerUser = async (e) => {
    e.preventDefault();
    document.querySelector(".loader-container").classList.remove('d-none');
    const elements = e.target.elements;

    const name = elements[0].value;
    const email = elements[1].value;
    const password = elements[2].value;
    try {

        const { data } = await axios.post(`${ApiURL}/auth/signup`, { name, email, password });
        if (data.message == "success") {
            setTimeout(() => {
                document.querySelector(".loader-container").classList.add('d-none');
                location.href = "index.html?register=ok";
            }, 2000);

        }
    } catch (error) {
        document.querySelector(".loader-container").classList.add('d-none');

        showToast({ msg: error.response.data.message, position: 'center', icon: 'error' })

    }
}
const loginUser = async (e) => {
    e.preventDefault();
    document.querySelector(".loader-container").classList.remove('d-none');

    const email = login_email.value;
    const password = login_password.value;

    try {
        const { data } = await axios.post(`${ApiURL}/auth/signin`, { password, email });
        console.log(data);
        if (data.message == "success") {
            localStorage.setItem("userToken", data.token);
            showToast({ msg: 'welcome' });
            setTimeout(() => {
                location.href = 'index.html';
            }, 3000);
        }
    } catch (error) {
        console.log(error.response);
        document.querySelector(".loader-container").classList.add('d-none');

        showToast({ msg: error.response.data.message, position: 'center', icon: 'error' })
    }
}

registerform?.addEventListener("submit", registerUser);
loginform?.addEventListener("submit", loginUser);
const handleSendCode = async (e) => {
    document.querySelector(".loader-container").classList.remove('d-none');
    e.preventDefault();
    try {
        const email = e.target.elements[0].value;
        localStorage.setItem('email', email);
        const { data } = await axios.patch(`${ApiURL}/auth/sendCode`, { email });
        if (data.message == 'success') {
            showToast({ msg: "code sent successfully , plz check your email" });
            var forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
            forgotPasswordModal.show();
            var forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
            forgotPasswordModal.show();
            document.querySelector(".loader-container").classList.add('d-none');

        }
    } catch (error) {
        showToast({ msg: error.response.data.message, icon: 'error' })
        document.querySelector(".loader-container").classList.add('d-none');

    }
};

const handleForgotPassword = async (e) => {
    document.querySelector(".loader-container").classList.remove('d-none');

    e.preventDefault();
    try {
        const elements = e.target.elements;
        const code = elements[0].value;
        const email = localStorage.getItem("email");
        const password = elements[1].value;
        const { data } = await axios.patch(`${ApiURL}/auth/forgotPassword`, { code, email, password });
        if (data.message == 'success') {
            showToast({ msg: "password is updated , you can login now" });

            localStorage.removeItem("email");
            setTimeout(() => {
                location.href = "index.html";
            }, 3000);
            document.querySelector(".loader-container").classList.add('d-none');

        }
    } catch (error) {
        showToast({ msg: error.response.data.message, icon: 'error' })
        document.querySelector(".loader-container").classList.add('d-none');

    }

}

sendCodeForm?.addEventListener("submit", handleSendCode);
forgotPasswordform?.addEventListener("submit", handleForgotPassword);


const logoutBtn = document.querySelector(".logout");
console.log(logoutBtn)

const logout = async () => {
    localStorage.removeItem("userToken");
    location.href = "index.html";
}
logoutBtn.addEventListener('click', logout)


async function showToast({ msg, position = 'top-end', timer = 3000, showConfirmButton = false, icon = 'success' }) {
    const Toast = Swal.mixin({
        toast: true,
        position: position,
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: showConfirmButton,
        timerProgressBar: true,
        timer: timer,
    })
    await Toast.fire({
        icon: icon,
        title: msg,
    })
}


//chatbots
(function (d, w, c) {
    w.ChatraID = 'WWxMPzLQXsi4hteNG';
    var s = d.createElement('script');
    w[c] = w[c] || function () {
        (w[c].q = w[c].q || []).push(arguments);
    };
    s.async = true;
    s.src = 'https://call.chatra.io/chatra.js';
    if (d.head) d.head.appendChild(s);
})(document, window, 'Chatra');