function populateProfileData() {
    profileUrl = String(window.localStorage.getItem('PROFILE_URL'));
    fullName = String(window.localStorage.getItem('NAME'));
    caption = String(window.localStorage.getItem('CAPTION'));
    createdAt = String(window.localStorage.getItem('CREATED_AT'));
    gender = String(window.localStorage.getItem('GENDER'));
    currentLocation = String(window.localStorage.getItem('LOCATION'));
    email = String(window.localStorage.getItem('EMAIL'));
    console.log(fullName);
    if(profileUrl!=='null'){
        document.getElementById('self-profile-image').src = profileUrl;
    }
    if(fullName!=='null'){
        document.getElementById('self-name').innerHTML = fullName;
        document.getElementById('self-about-name').innerHTML = fullName;
    }
    if(caption!=='null'){
        document.getElementById('self-caption').innerHTML = caption;
    }
    if(createdAt!=='null'){
        document.getElementById('self-created-at').innerHTML = createdAt;
    }
    if(gender!=='null'){
        document.getElementById('self-about-gender').innerHTML = gender;
    }
    if(currentLocation!=='null'){
        document.getElementById('self-about-location').innerHTML = currentLocation;
    }
    if(email!=='null'){
        document.getElementById('self-about-email').innerHTML = email;
        document.getElementById('self-about-email').href = email;
    }
}

var openmodal = document.querySelectorAll('.modal-open')
for (var i = 0; i < openmodal.length; i++) {
    openmodal[i].addEventListener('click', function(event){
    event.preventDefault()
    toggleModal()
    })
}

const overlay = document.querySelector('.modal-overlay')
overlay.addEventListener('click', toggleModal)

var closemodal = document.querySelectorAll('.modal-close')
for (var i = 0; i < closemodal.length; i++) {
    closemodal[i].addEventListener('click', toggleModal)
}

document.onkeydown = function(evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
    isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
    isEscape = (evt.keyCode === 27)
    }
    if (isEscape && document.body.classList.contains('modal-active')) {
    toggleModal()
    }
};


function toggleModal () {
    const body = document.querySelector('body')
    const modal = document.querySelector('.modal')
    modal.classList.toggle('opacity-0')
    modal.classList.toggle('pointer-events-none')
    body.classList.toggle('modal-active')
}

populateProfileData();