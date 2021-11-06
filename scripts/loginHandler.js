
function validateLoginEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email === null || email.length === 0 || !re.test(email)){
        return false;
    }
    return true;
}

function validateLoginPassowrd(password){
    if(password === null || password.length < 8){
        return false;
    }
    return true;
}


function loginInputHandler(){
    emailBox = document.getElementById('login-email');
    passwordBox = document.getElementById('login-password');
    console.log(emailBox.value, passwordBox.value);
    if(!validateLoginEmail(emailBox.value)){
        alert('Enter valid email');
        return;
    }
    if(!validateLoginPassowrd(passwordBox.value)){
        alert('Enter valid password');
        return;
    }
    // TODO: DB operation and account exists check
}