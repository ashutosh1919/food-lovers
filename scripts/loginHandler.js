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

function locallyStoreUser(res) {
    console.log(res);
    if('email' in res){
        window.localStorage.setItem('EMAIL', res.email);
    }
    if('name' in res){
        window.localStorage.setItem('NAME', res.name);
    }
    if('gender' in res){
        window.localStorage.setItem('GENDER', res.gender);
    }
    if('profile' in res){
        window.localStorage.setItem('PROFILE_URL', res.profile);
    }
    if('location' in res){
        window.localStorage.setItem('LOCATION', res.location);
    }
    if('caption' in res){
        window.localStorage.setItem('CAPTION', res.caption);
    }
    if('created_at' in res){
        window.localStorage.setItem('CREATED_AT', res.created_at);
    }
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
    data = { "email": emailBox.value, "password": passwordBox.value};
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/login',
        // headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'},
        data: JSON.stringify(data),
        success: function(res) {
            console.log(JSON.stringify(res));
            if("error" in res){
                alert(res["error"]);
                return;
            }

            console.log(res);
            var expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
            document.cookie = "FOOD_LOVERS_LOGIN=" + res["email"] + "; expires=" + expires + ";path=/;";
            locallyStoreUser(res);
            window.location.href = 'home.html';
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })
}

function displayImageOnProfileIcon(){
    let profileUrl = String(window.localStorage.getItem('PROFILE_URL'));
    // console.log(profileUrl);
    if(profileUrl!='null'){
        document.getElementById('nav-profile-img-icon').src = profileUrl;
    }
}

function alterNavigation(isLoggedIn){
    profileImage = document.getElementById('nav-profile-img');
    loginButton = document.getElementById('nav-login-btn');
    signupButton = document.getElementById('nav-signup-btn');
    profileImageMobile = document.getElementById('nav-profile-img-mobile');
    loginButtonMobile = document.getElementById('nav-login-btn-mobile');
    signupButtonMobile = document.getElementById('nav-signup-btn-mobile');
    if(isLoggedIn){
        profileImage.style.display = 'visible';
        displayImageOnProfileIcon();
        loginButton.style.display = 'none';
        signupButton.style.display = 'none';
        profileImageMobile.style.display = 'visible';
        loginButtonMobile.style.display = 'none';
        signupButtonMobile.style.display = 'none';
    }
    else {
        profileImage.style.display = 'none';
        loginButton.style.display = 'visible';
        signupButton.style.display = 'visible';
        profileImageMobile.style.display = 'none';
        loginButtonMobile.style.display = 'visible';
        signupButtonMobile.style.display = 'visible';
    }
}

function checkAlreadyLoggedIn(){
    if(typeof $.cookie('FOOD_LOVERS_LOGIN') === 'undefined'){
        return false;
    }
    else {
        return true;
    }
}

function updateStorageIfLoggedIn(){
    if(checkAlreadyLoggedIn()){
        let email = $.cookie('FOOD_LOVERS_LOGIN')
        window.localStorage.setItem('EMAIL', email);
        alterNavigation(true);
    }
    else {
        alterNavigation(false);
    }
}

updateStorageIfLoggedIn();