
function validateSignupName(name){
    if(name === null || name.length < 6){
        return false;
    }
    return true;
}

function validateSignupEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email === null || email.length === 0 || !re.test(email)){
        return false;
    }
    return true;
}

function validateSignupPassword(password){
    if(password === null || password.length < 8){
        return false;
    }
    return true;
}

function signupInputHandler(){
    nameBox = document.getElementById('signup-name');
    emailBox = document.getElementById('signup-email');
    passwordBox = document.getElementById('signup-password');
    confirmPasswordBox = document.getElementById('signup-confirm-password');
    console.log(nameBox.value, emailBox.value, passwordBox.value, confirmPasswordBox.value);
    if(!validateSignupName(nameBox.value)){
        alert('Enter Full Name of atleast 6 characters.');
        return;
    }
    if(!validateSignupEmail(emailBox.value)){
        alert('Enter valid email.');
        return;
    }
    if(!validateSignupPassword(passwordBox.value)){
        alert('Enter passowrd containing atleast 8 characters.');
        return;
    }
    if(passwordBox.value !== confirmPasswordBox.value){
        alert('Password and Confirm Password should match.');
        return;
    }
    // TODO: DB operation for registering user.
    data = { "function": "create_user", "name": nameBox.value, "email": emailBox.value, "password": passwordBox.value}
    console.log(data);
    $.ajax({
        type: 'POST',
        url: '../server/rest.php',
        data: JSON.stringify(data),
        success: function(res) {
            console.log(res);
            window.location.href = 'home.html';
        },
        error: function(err){
            console.log(JSON.stringify(err));
        }
    })
}