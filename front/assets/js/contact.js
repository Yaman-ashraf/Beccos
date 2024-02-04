const contactForm = document.querySelector(".contactForm");
contactForm.onsubmit = async function(e){
    e.preventDefault();
    const elements = e.target.elements;
    const contact = {
        name:elements['name'].value,
        email:elements['email'].value,
        phone:elements['phone'].value,
        title:elements['title'].value,
        message:elements['message'].value,


    }
    const {data} = await axios.post(`https://beccos.onrender.com/user/contact`,contact);
    if(data.message=='success'){
        showToast({msg:'email sent successfully'});
    }
}

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
