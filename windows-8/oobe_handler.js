document.addEventListener("DOMContentLoaded", () => {
    const textpassword = document.getElementById("current-password");
    const showPassBtn = document.getElementById("show-password");

    showPassBtn.addEventListener('click', () => {
        if (textpassword.type === 'password') {
            showPassBtn.classList.add('isToggle');
            textpassword.type = 'text';
        } else {
            textpassword.type = 'password';
            showPassBtn.classList.remove('isToggle');
        }
    });
});

window.onload = () => { 
    
    const getImg = document.getElementById('default-user');
    document.getElementById('btn-upload').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', (event) => {
        const reachFile = event.target.files[0];
        if (reachFile) {
            const reader = new FileReader();
            reader.addEventListener('load', function(e) {
                getImg.src = e.target.result;
            });
            reader.readAsDataURL(reachFile);
        }
    
        document.getElementById('btn-del').addEventListener('click', deleteImage);
    });
    
    function deleteImage() {
        img.src = '/icon/windows8_account_picture.png';
    };
}

let currentStep = 0;

function gotoStep(step) {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");

    let errorMsgUser = document.querySelector('#msgUser');
    let errorMsgEmail = document.querySelector('#msgEmail');
    let errorMsgPass = document.querySelector('#msgPass');
    let errorMsgConfirmPass = document.querySelector('#msgConfirmPass');

    if (step === 1) {
        if (username === '' || username.length < 2) {
            errorMsgUser.textContent = "Please enter a valid username. A username must equal or more than 2 characters";
            return;
        }
        else {
            errorMsgUser.textContent = ""
        }
        
    }    
    else if (step === 2) {
        let emailName = "";
        let domain = email.includes("@gmail.com") + email.includes("@hotmail.com") + email.includes("@outlook.com");
        if (email === '' || !domain && !email.includes(emailName + domain)) {
            errorMsgEmail.textContent = "Please enter a valid email.";
            return;
        } 
        else {
            errorMsgEmail.textContent = "";
        }

        if (password.value === '' && confirmPassword.value === '') {
            errorMsgPass.textContent = "This field cannot be empty.";
            errorMsgConfirmPass.textContent = "This field cannot be empty";
            return;
        }
        else if (password.value !== confirmPassword.value) {
            errorMsgPass.textContent = "";
            errorMsgConfirmPass.textContent = "A confirm password must be the same as your password.";
            return;
        }
        else if (password.value.length < 8 && confirmPassword.value.length < 8) {
            errorMsgPass.textContent = "A password must have 8 characters or more.";
            errorMsgConfirmPass.textContent = "A confirm password must have 8 characters or more.";
            return;
        }
        else {
            errorMsgPass.textContent = "";
            errorMsgConfirmPass.textContent = "";
        }
    }
    else if (step === 3) {
        // kosong
    }
    else if (step === 4) {
        setTimeout(() => {
            try {
                createNewAccount(getUserName, getEmail, getPassword);
            }
            finally {
                document.querySelector(".step-" + currentStep).classList.remove("active");
                currentStep++;
                document.querySelector(".step-" + currentStep).classList.add("active");
            }
        }, 5000)
    }

    const getUserName = username;
    document.getElementById("get_username").innerHTML = getUserName;
    const getEmail = email;
    const getPassword = confirmPassword;
    nextStep();
}

window.addEventListener('submit', (event) => {
    event.preventDefault();
    nextStep();
});

function nextStep() {
    document.querySelector(".step-" + currentStep).classList.remove("active");
    currentStep++;
    document.querySelector(".step-" + currentStep).classList.add("active");
}
function backToStep(step) {
    document.querySelector('.step-' + currentStep).classList.remove('active');
    currentStep--;
    document.querySelector('.step-' + currentStep).classList.add('active');
}

async function createNewAccount(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;

    fetch("/Element/header.html")
        .then(response => {
            if (response.ok) {
                
            } else {
                throw new Error("An error has been occured.");
            }
            return response.text();
        })
        .then (data => {
            JSON.stringify(document.querySelector('header').innerHTML = data);
        })
}