if(typeof $.cookie('FOOD_LOVERS_LOGIN') === 'undefined'){
    window.location.href = 'login.html';
}

function getStoredProfile(){
    let profileUrl = String(window.localStorage.getItem('PROFILE_URL'));
    let fullName = String(window.localStorage.getItem('NAME'));
    let caption = String(window.localStorage.getItem('CAPTION'));
    let createdAt = String(window.localStorage.getItem('CREATED_AT'));
    let gender = String(window.localStorage.getItem('GENDER'));
    let currentLocation = String(window.localStorage.getItem('LOCATION'));
    let email = String(window.localStorage.getItem('EMAIL'));
    return [profileUrl, fullName, caption, createdAt, gender, currentLocation, email]
}

function populatePostCards(data){
    let postSection = document.getElementById('self-posts');
    console.log(data);

    for(let i = 0; i < data.length; i++){
        let dish = data[i];

        // Card div
        let postCard = document.createElement('div');
        postCard.className = 'rounded overflow-hidden shadow-lg';

        // Image
        let dishImage = document.createElement('img');
        dishImage.className = 'w-full h-64 object-cover';
        dishImage.src = dish["DISH_IMG_URL"];
        dishImage.alt = dish["DISH_NAME"];

        // Text div
        let textDiv = document.createElement('div');
        textDiv.className = 'px-6 py-4';
        let titleText = document.createElement('div');
        titleText.className = 'font-medium text-xl mb-2 overflow-ellipsis overflow-hidden whitespace-nowrap';
        titleText.textContent = dish["DISH_NAME"];
        textDiv.appendChild(titleText);
        let captionText = document.createElement('p');
        captionText.className = 'font-regular text-gray-600 text-base leading-normal h-12 overflow-ellipsis overflow-hidden w-full';
        let ings = dish["DISH_INGREDIENTS"];
        ings = ings.replaceAll('$', ', ').trim(', ');
        captionText.textContent = ings;
        textDiv.appendChild(captionText);

        // Tag div
        let tagDiv = document.createElement('div');
        tagDiv.className = 'px-6 pb-2';
        let tagSpan = document.createElement('span');
        tagSpan.className = 'inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2';
        tagSpan.textContent = dish["CUISINE_TYPE"];
        tagDiv.appendChild(tagSpan);

        postCard.appendChild(dishImage);
        postCard.appendChild(textDiv);
        postCard.appendChild(tagDiv);

        postSection.appendChild(postCard);
    }

}

function populatePosts(){
    let ownerEmail = window.localStorage.getItem('EMAIL');
    if(ownerEmail === null || ownerEmail === undefined){
        document.getElementById('self-posts').style.display = 'none';
    }
    else {
        document.getElementById('self-no-posts').style.display = 'none';
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/getSelfPostedDishes',
            data: JSON.stringify({'owner_email': ownerEmail}),
            success: function(res) {
                // console.log(JSON.stringify(res));
                // console.log('Response', res);
                console.log(typeof res);
                data = JSON.parse(res);
                populatePostCards(data["data"]);
            },
            error: function(error){
                console.log('Error');
                console.log(JSON.stringify(error));
            }
        })
    }
}

function populateProfileData() {
    const [profileUrl, fullName, caption, createdAt, gender, currentLocation, email] = getStoredProfile(); 
    if(profileUrl!=='null'){
        // console.log(profileUrl);
        document.getElementById('self-profile-image').src = profileUrl;
        document.getElementById('self-edit-profile').src = profileUrl;
    }
    if(fullName!=='null'){
        document.getElementById('self-name').innerHTML = fullName;
        document.getElementById('self-about-name').innerHTML = fullName;
        document.getElementById('self-edit-name').value = fullName;
    }
    if(caption!=='null'){
        document.getElementById('self-caption').innerHTML = caption;
        document.getElementById('self-edit-caption').value = caption;
    }
    if(createdAt!=='null'){
        document.getElementById('self-created-at').innerHTML = createdAt;
    }
    if(gender!=='null'){
        document.getElementById('self-about-gender').innerHTML = gender;
        if(gender==="Male"){
            document.getElementById('self-edit-male').checked = true;
        }
        else {
            document.getElementById('self-edit-female').checked = true;
        }
    }
    if(currentLocation!=='null'){
        document.getElementById('self-about-location').innerHTML = currentLocation;
        document.getElementById('self-edit-location').value = currentLocation;
    }
    if(email!=='null'){
        document.getElementById('self-about-email').innerHTML = email;
        document.getElementById('self-about-email').href = 'mailto:' + email;
        document.getElementById('self-edit-email').value = email;
    }
    populatePosts();
}

function locallyStoreUser(res) {
    // console.log(res);
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

function editProfileChange(){
    var preview = document.getElementById('self-edit-profile');
    var file = document.getElementById('self-upload-profile').files[0];
    var reader  = new FileReader();
 
    reader.addEventListener("load", function () {
        // convert image file to base64 string
        preview.src = reader.result;
      }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
}

function collectChangedProfileData() {
    const [storedProfileUrl,
        storedFullName,
        storedCaption,
        storedCreatedAt,
        storedGender,
        storedCurrentLocation,
        storedEmail] = getStoredProfile();
    let profileImage = document.getElementById('self-edit-profile');
    let fullName = document.getElementById('self-edit-name');
    let email = document.getElementById('self-edit-email');
    let currentLocation = document.getElementById('self-edit-location');
    let genderMale = document.getElementById('self-edit-male');
    let genderFemale = document.getElementById('self-edit-female');
    let caption = document.getElementById('self-edit-caption');
    let defaultImageUrl = new URL('../assets/images/default-profile.jpeg', window.location.protocol + '//' + window.location.host + window.location.pathname).href;
    
    // console.log(
    //     fullName.value,
    //     email.value,
    //     currentLocation.value,
    //     genderMale.checked
    // );

    let updatedData = {};
    if(profileImage.src !== defaultImageUrl && profileImage.src !== storedProfileUrl){
        updatedData["profile"] = profileImage.src;
        // console.log(profileImage.src);
    }
    if(fullName.value.trim()!==storedFullName){
        const fName = fullName.value.trim();
        if(fName.length < 6){
            alert('Full Name should be of atleast 6 characters.');
            return null;
        }
        updatedData["name"] = fName;
    }
    if(email.value.trim()!==storedEmail){
        const eText = email.value.trim();
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(eText === null || eText.length === 0 || !re.test(eText)){
            alert('Enter valid email.');
            return null;
        }
        updatedData["oldEmail"] = storedEmail;
        updatedData["newEmail"] = eText;
    }
    else {
        updatedData["newEmail"] = email.value.trim();
    }
    if(currentLocation.value.trim()!==storedCurrentLocation && currentLocation.value.trim()!==''){
        updatedData["location"] = currentLocation.value.trim();
    }
    if(genderMale.checked && storedGender!=="Male"){
        updatedData["gender"] = "Male";
    }
    else if(genderFemale.checked && storedGender!=="Female"){
        updatedData["gender"] = "Female";
    }
    if(caption.value.trim()!==storedCaption){
        if(caption.value.trim()!=="" || (caption.value.trim()==="" && storedCaption!=="null")){
            updatedData["caption"] = caption.value.trim();
        }
    }
    toggleModal();
    return updatedData;
}

function onSavingEditForm(){
    let changedData = collectChangedProfileData();
    if(changedData === null || Object.keys(changedData).length === 0){
        return;
    }
    if("newEmail" in changedData && Object.keys(changedData).length == 1){
        return;
    }
    // changedData["function"] = "update_user";
    // console.log(changedData);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/updateUser',
        data: JSON.stringify(changedData),
        success: function(res) {
            // console.log(JSON.stringify(res));
            console.log('Response', res);
            var expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
            document.cookie = "FOOD_LOVERS_LOGIN=" + res["email"] + "; expires=" + expires + ";path=/;";
            locallyStoreUser(res);
            populateProfileData();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })
}

function handleLogout(){
    $.removeCookie('FOOD_LOVERS_LOGIN', { path: '/' });
    window.location.href = 'home.html';
    storageKeys = ['PROFILE_URL', 'NAME', 'EMAIL', 'LOCATION', 'CREATED_AT', 'CAPTION', 'GENDER']
    for(let i=0; i<storageKeys.length; i++){
        if(storageKeys[i] in window.localStorage){
            window.localStorage.removeItem(storageKeys[i]);
        }
    }
}

// Edit Profile Modal Start
var openmodal = document.querySelectorAll('.modal-open')
for (var i = 0; i < openmodal.length; i++) {
    openmodal[i].addEventListener('click', function(event){
    event.preventDefault();
    populateProfileData();
    toggleModal();
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
// Edit Profile Modal End



function addIngredientInput(){
    let ingredientsList = document.getElementById('post-ingredients-inputs');
    let childCount = ingredientsList.childElementCount;
    // console.log(childCount);
    let placeholderText = "Ingredient " + String(childCount + 1);
    let newIngredient = document.createElement('input');
    newIngredient.type = 'text';
    newIngredient.className = 'bg-blue-50 border border-gray-300 text-gray-900 sm:text-sm font-light rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 mb-2';
    newIngredient.placeholder = placeholderText;
    ingredientsList.appendChild(newIngredient);
}

function accumulateIngredients(){
    let ingredients = "";
    $('#post-ingredients-inputs input').each(function () {
        if(this.value.trim() !== ''){
            ingredients += this.value.trim() + '$';
        }
    });

    if(ingredients.length === 0){
        alert('There must be at least 1 ingredient');
        return null;
    }
    return ingredients;
}

function collectPostedDishData(){
    let dishImage = document.getElementById('post-dish-image');
    let dishName = document.getElementById('post-dish-name');
    let cuisineType = document.getElementById('post-cuisine-types');
    let directions = document.getElementById('post-directions');
    let prepTime = document.getElementById('post-prep-time');
    let dishVideo = document.getElementById('post-dish-video');
    let postedDish = {}

    if(dishImage.files.length > 0){
        postedDish['dish_image'] = dishImage.files[0];
    }
    else{
        alert('To post a recipe, it must contain image.');
        return null;
    }

    if(dishName.value.trim() !== ''){
        postedDish['dish_name'] = dishName.value.trim();
    }
    else{
        alert('To post a recipe, it must contain name.');
        return null;
    }

    postedDish['cuisine_type'] = cuisineType.options[cuisineType.selectedIndex].text;

    let ingredients = accumulateIngredients();
    if(ingredients === null){
        return null;
    }
    postedDish['dish_ingredients'] = ingredients;

    if(directions.value.trim() !== ''){
        postedDish['dish_directions'] = directions.value.trim();
    }
    else{
        alert('You must include direction steps in the recipe.');
        return null;
    }

    if(prepTime.value.trim() !== ''){
        postedDish['dish_prepTime'] = prepTime.value.trim();
    }
    else{
        alert('You must include estimated prepation time in the recipe.');
        return null;
    }

    if(dishVideo.files.length > 0) {
        postedDish['dish_video'] = dishVideo.files[0];
    }

    return postedDish;
}

function onDishPost(){
    let dishData = collectPostedDishData();
    if(dishData === null){
        return;
    }
    togglePostModal();
    dishData["owner_email"] = String(window.localStorage.getItem('EMAIL'));
    var form_data = new FormData();

    for ( var key in dishData ) {
        form_data.append(key, dishData[key]);
    }
    console.log(dishData);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/postDish',
        contentType: false,
        processData: false,
        data: form_data,
        success: function(res) {
            // console.log(JSON.stringify(res));
            console.log('Response', res);
            populatePosts();
            // var expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
            // document.cookie = "FOOD_LOVERS_LOGIN=" + res["email"] + "; expires=" + expires + ";path=/;";
            // locallyStoreUser(res);
            // populateProfileData();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })

}


// Create Post Modal Start
var postopenmodal = document.querySelectorAll('.post-modal-open')
for (var i = 0; i < postopenmodal.length; i++) {
    postopenmodal[i].addEventListener('click', function(event){
    event.preventDefault();
    togglePostModal();
    })
}

const postoverlay = document.querySelector('.post-modal-overlay')
postoverlay.addEventListener('click', togglePostModal)

var postclosemodal = document.querySelectorAll('.post-modal-close')
for (var i = 0; i < closemodal.length; i++) {
    postclosemodal[i].addEventListener('click', togglePostModal)
}

document.onkeydown = function(evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
    isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
    isEscape = (evt.keyCode === 27)
    }
    if (isEscape && document.body.classList.contains('post-modal-active')) {
        togglePostModal()
    }
};


function togglePostModal () {
    const body = document.querySelector('body')
    const modal = document.querySelector('.post-modal')
    modal.classList.toggle('opacity-0')
    modal.classList.toggle('pointer-events-none')
    body.classList.toggle('post-modal-active')
}
// Edit Profile Modal End

populateProfileData();