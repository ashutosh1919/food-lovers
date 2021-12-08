function getOtherStoredProfile(){
    let ownerEmail = window.localStorage.getItem('WATCH_PROFILE_EMAIL');
    let x = $.ajax({
        type: 'POST',
        async: false,
        url: 'http://localhost:8000/getUser',
        data: JSON.stringify({'email': ownerEmail}),
        success: function(res) {
            // console.log(JSON.stringify(res));
            // console.log('Response', res);
            data = JSON.parse(res);
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })

    if(x.status === 200){
        let data = JSON.parse(x.responseText);
        let profileUrl = String(data["profile"]);
        let fullName = String(data["name"]);
        let caption = String(data["caption"]);
        let createdAt = String(data["created_at"]);
        let gender = String(data["gender"]);
        let currentLocation = String(data["location"]);
        let email = String(data["email"]);
        return [profileUrl, fullName, caption, createdAt, gender, currentLocation, email]
    }
    // let profileUrl = String(window.localStorage.getItem('PROFILE_URL'));
    // let fullName = String(window.localStorage.getItem('NAME'));
    // let caption = String(window.localStorage.getItem('CAPTION'));
    // let createdAt = String(window.localStorage.getItem('CREATED_AT'));
    // let gender = String(window.localStorage.getItem('GENDER'));
    // let currentLocation = String(window.localStorage.getItem('LOCATION'));
    // let email = String(window.localStorage.getItem('EMAIL'));
    // return [profileUrl, fullName, caption, createdAt, gender, currentLocation, email]
}

function populatePostCards(data){
    let postSection = document.getElementById('other-posts');
    console.log(data);

    for(let i = 0; i < data.length; i++){
        let dish = data[i];

        // Card div
        let postCard = document.createElement('div');
        postCard.className = 'rounded overflow-hidden shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 ...';

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
        tagDiv.className = 'px-6 pb-2 flex flex-row';
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

function populateOtherPosts(){
    let ownerEmail = window.localStorage.getItem('WATCH_PROFILE_EMAIL');
    if(ownerEmail === null || ownerEmail === undefined){
        document.getElementById('other-posts').style.display = 'none';
    }
    else {
        document.getElementById('other-no-posts').style.display = 'none';
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/getSelfPostedDishes',
            data: JSON.stringify({'owner_email': ownerEmail}),
            success: function(res) {
                // console.log(JSON.stringify(res));
                // console.log('Response', res);
                console.log(typeof res);
                data = JSON.parse(res);
                console.log(data);
                if(data["data"].length === 0){
                    console.log('Hi');
                    document.getElementById('other-no-posts').style.display = 'block';
                }
                else{
                    populatePostCards(data["data"]);
                }
            },
            error: function(error){
                console.log('Error');
                console.log(JSON.stringify(error));
            }
        })
    }
}

function populateOtherProfileData() {
    const [profileUrl, fullName, caption, createdAt, gender, currentLocation, email] = getOtherStoredProfile(); 
    if(profileUrl!=='null'){
        // console.log(profileUrl);
        document.getElementById('other-profile-image').src = profileUrl;
    }
    if(fullName!=='null'){
        document.getElementById('other-name').innerHTML = fullName;
        document.getElementById('other-about-name').innerHTML = fullName;
    }
    if(caption!=='null'){
        document.getElementById('other-caption').innerHTML = caption;
    }
    if(createdAt!=='null'){
        document.getElementById('other-created-at').innerHTML = createdAt;
    }
    if(gender!=='null'){
        document.getElementById('other-about-gender').innerHTML = gender;
    }
    if(currentLocation!=='null'){
        document.getElementById('other-about-location').innerHTML = currentLocation;
    }
    if(email!=='null'){
        document.getElementById('other-about-email').innerHTML = email;
        document.getElementById('other-about-email').href = 'mailto:' + email;
    }
    populateOtherPosts();
}

populateOtherProfileData();