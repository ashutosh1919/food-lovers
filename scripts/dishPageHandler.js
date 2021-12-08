// Handling Dish Details
function fetchDishDetails(){
    let dish_id = window.localStorage.getItem('WATCH_DISH_ID');
    let dishPromise = $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/getDish',
        data: JSON.stringify({"dish_id": dish_id}),
        async: false,
        success: function(res) {
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });

    if(dishPromise.status === 200){
        let data = JSON.parse(dishPromise.responseText);
        let dishId = String(data["DISH_ID"]);
        let dishName = String(data["DISH_NAME"]);
        let cuisineType = String(data["CUISINE_TYPE"]);
        let dishImage = String(data["DISH_IMG_URL"]);
        let dishIngredients = data["DISH_INGREDIENTS"];
        let dishDirections = data["DISH_DIRECTIONS"];
        let dishVideo = data["DISH_VIDEO_URL"];
        let dishOwnerId = data["OWNER_ID"];
        let dishPrepTime = data["PREP_TIME"];
        let dishPostedAt = data["DISH_POSTED_AT"];
        return [dishId, dishName, cuisineType, dishImage, dishIngredients, dishDirections, dishVideo, dishOwnerId, dishPrepTime, dishPostedAt];
    }
}

function onProfileClick(email){
    window.localStorage.setItem('WATCH_PROFILE_EMAIL', email);
    window.location.href = 'otherprofile.html'; 
}

function onSelfProfileClick(){
    window.location.href = "profile.html";
}

async function populateDishVideo(dishVideo){
    document.getElementById('dish-page-video-present').style.display = 'inline-block';
    document.getElementById('dish-page-video').style.display = 'block';
    let videoSource = document.createElement('source');
    videoSource.src = dishVideo;
    document.getElementById('dish-page-video').appendChild(videoSource);
}

function populateDishDetails(){
    let [dishId, dishName, cuisineType, dishImage, dishIngredients, dishDirections, dishVideo, dishOwnerId, dishPrepTime, dishPostedAt] = fetchDishDetails();

    window.lazyLoadOptions = {
        elements_selector: ".lazyloadvideo"
      };    
    
    document.getElementById('dish-page-image').src = dishImage;
    document.getElementById('dish-page-name').textContent = dishName;
    document.getElementById('dish-page-prep-time').textContent = dishPrepTime;
    document.getElementById('dish-page-cuisine-type').textContent = cuisineType;
    let ingredientsP = document.getElementById('dish-page-ingredients');
    let ingredients = dishIngredients.split('$');
    for(let i=0;i<ingredients.length;i++){
        if(ingredients[i].trim().length > 0){
            let ingr = document.createElement('span');
            let ingli = document.createElement('li');
            ingli.className = 'text-base font-regular';
            ingli.textContent = ingredients[i].trim();
            ingr.appendChild(ingli);
            ingredientsP.appendChild(ingr);
        }
    }

    document.getElementById('dish-page-direction-text').textContent = dishDirections;
    [profileUrl, fullName, email, caption] = fetchCommentorDetails(dishOwnerId);
    if(profileUrl !== '' && profileUrl !== 'null'){
        document.getElementById('dish-page-owner-image').src = profileUrl;
    }
    document.getElementById('dish-page-owner-image').style.border = getBorderBadgeForUser(email);
    document.getElementById('dish-page-owner-image').onclick = () => {
        if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === email) {
            onSelfProfileClick();
        }
        else{
            onProfileClick(email);
        }
    }
    document.getElementById('dish-page-owner-name').textContent = fullName;
    document.getElementById('dish-page-owner-name').onclick = (element) => {
        if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === email) {
            onSelfProfileClick();
        }
        else{
            onProfileClick(email);
        }
    }
    if(caption === 'null'){
        caption = '';
    }
    document.getElementById('dish-page-owner-caption').textContent = caption;

    if(dishVideo !== ''){
        populateDishVideo(dishVideo);
    }
}


// Handling comments
function onCommentSubmitted(){
    let commentBox = document.getElementById('dish-new-comment-text');
    let commentsData = {};

    if(commentBox.value.trim() === ''){
        alert('Comment must be non-empty.');
        return;
    }
    commentsData["comment_text"] = commentBox.value.trim();

    if("EMAIL" in window.localStorage){
        commentsData["email"] = window.localStorage.getItem('EMAIL');
    }
    else {
        alert("You must be logged in to comment");
        return;
    }

    if("WATCH_DISH_ID" in window.localStorage){
        commentsData["dish_id"] = window.localStorage.getItem('WATCH_DISH_ID');
    }
    else{
        alert("You must be watching the dish page while commenting");
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/postDishComment',
        data: JSON.stringify(commentsData),
        success: function(res) {
            populateDishComments();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function populateCommentCards(data){
    let commentSection = document.getElementById('dish-comments');
    removeAllChildNodes(commentSection);

    for(let i = 0; i < data.length; i++){
        commentDetails = data[i];

        // Comment card
        let commentCard = document.createElement('div');
        commentCard.className = 'flex flex-row w-full p-2';

        // Commentor details
        [profileUrl, fullName, email, caption] = fetchCommentorDetails(commentDetails["OWNER_ID"]);

        // Commentor Profile;
        let commentorImage = document.createElement('img');
        commentorImage.className = 'w-14 md:w-20 h-14 md:h-20 mr-2 object-cover rounded-full cursor-pointer';
        if(profileUrl === 'null'){
            commentorImage.src = '../assets/images/default-profile.jpeg';
        }
        else{
            commentorImage.src = profileUrl;
        }
        commentorImage.id = email;
        commentorImage.style.border = getBorderBadgeForUser(email);
        commentorImage.onclick = (element) => {
            if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === element.target.id) {
                onSelfProfileClick();
            }
            else{
                onProfileClick(element.target.id);
            }
        }

        // Commentor Name-Comment Div
        let commentorNestedDiv = document.createElement('div');
        commentorNestedDiv.className = 'ml-2';

        let commentorName = document.createElement('h2');
        commentorName.className = 'text-gray-800 text-lg font-medium mb-2 cursor-pointer';
        commentorName.textContent = fullName;
        commentorName.id = email;
        commentorName.onclick = (element) => {
            if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === element.target.id) {
                onSelfProfileClick();
            }
            else{
                onProfileClick(element.target.id);
            }
        }
        commentorNestedDiv.appendChild(commentorName);

        let commentP = document.createElement('p');
        commentP.className = 'font-regular text-gray-600';
        commentP.textContent = commentDetails["COMMENT_TEXT"];
        commentorNestedDiv.appendChild(commentP);

        commentCard.appendChild(commentorImage);
        commentCard.appendChild(commentorNestedDiv);

        commentSection.appendChild(commentCard);
    }
}

function fetchCommentorDetails(userId){
    let userPromise = $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/getUserFromId',
        async: false,
        data: JSON.stringify({'id': userId}),
        success: function(res) {
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });

    if(userPromise.status === 200){
        let data = JSON.parse(userPromise.responseText);
        let profileUrl = String(data["profile"]);
        let fullName = String(data["name"]);
        let email = String(data["email"]);
        let caption = String(data["caption"])
        return [profileUrl, fullName, email, caption];
    }
}

function populateDishComments(){
    let noComments = document.getElementById('dish-no-comments');
    let yesComments = document.getElementById('dish-comments');
    noComments.style.display = 'block';
    yesComments.style.display = 'none';
    if("WATCH_DISH_ID" in window.localStorage){
        let dish_id = window.localStorage.getItem('WATCH_DISH_ID');
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/getDishComments',
            data: JSON.stringify({'dish_id': dish_id}),
            success: function(res) {
                let data = JSON.parse(res);
                if(data["data"].length > 0){
                    noComments.style.display = 'none';
                    yesComments.style.display = 'block';
                    populateCommentCards(data["data"]);
                }
            },
            error: function(error){
                console.log('Error');
                console.log(JSON.stringify(error));
            }
        });
    }
}

// Like functionality
function fetchLikeRelatedDetails(showElert=true){
    let likeData = {};
    if("EMAIL" in window.localStorage){
        likeData["email"] = window.localStorage.getItem('EMAIL');
    }
    else {
        if(showElert){
            alert("You must be logged in to comment");
        }
        return null;
    }

    if("WATCH_DISH_ID" in window.localStorage){
        likeData["dish_id"] = window.localStorage.getItem('WATCH_DISH_ID');
    }
    else{
        if(showElert){
            alert("You must be watching the dish page while commenting");
        }
        return null;
    }
    return likeData;
}

function likeDish(element){
    let likeData = fetchLikeRelatedDetails();
    if(likeData === null){
        return null;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/likeDish',
        data: JSON.stringify(likeData),
        success: function(res) {
            element.setAttribute('fill', '#EC4899');
            displayLikesCount();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });
}

function unlikeDish(element){
    let likeData = fetchLikeRelatedDetails();
    if(likeData === null){
        return null;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/unlikeDish',
        data: JSON.stringify(likeData),
        success: function(res) {
            element.setAttribute('fill', '#FFFFFF');
            displayLikesCount();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });
}

function toggleLikeButton(element){
    if(element.getAttribute('fill') === '#FFFFFF'){
        likeDish(element);
    }
    else{
        unlikeDish(element);
    }
}

function displayLikesCount(){
    let countLikes = document.getElementById('dish-page-num-likes');
    if("WATCH_DISH_ID" in window.localStorage){
        let dish_id = window.localStorage.getItem('WATCH_DISH_ID');
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/countLikes',
            data: JSON.stringify({"dish_id": dish_id}),
            success: function(res) {
                data = JSON.parse(res);
                countLikes.textContent = data["likes"];
            },
            error: function(error){
                console.log('Error');
                console.log(JSON.stringify(error));
            }
        });
    }
}

function initializeLikeButton(){
    let likeButton = document.getElementById('dish-page-like-btn');
    let likeData = fetchLikeRelatedDetails(false);
    if(likeData === null){
        likeButton.setAttribute('fill', '#FFFFFF');
        return null;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/countUserLikes',
        data: JSON.stringify(likeData),
        success: function(res) {
            data = JSON.parse(res);
            if(data["likes"]===0){
                likeButton.setAttribute('fill', '#FFFFFF');
            }
            else {
                likeButton.setAttribute('fill', '#EC4899');
            }
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });
}

function getBorderBadgeForUser(userEmail){
    let likes = fetchTotalUserLikes(userEmail);
    let badgeColor = getBadgeColorFromLikes(likes);
    return "2px solid " + badgeColor;
}

function fetchTotalUserLikes(userEmail){
    let likesPromise = $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/countTotalLikesUser',
        data: JSON.stringify({"user_email": userEmail}),
        async: false,
        success: function(res) {
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });

    if(likesPromise.status === 200){
        let data = JSON.parse(likesPromise.responseText);
        return data["likes"];
    }
    return 0;
}

function getBadgeColorFromLikes(numLikes){
    if(numLikes < 5){
        return "#2563EB";
    }
    if(numLikes < 20){
        return "#059669";
    }
    if(numLikes < 100){
        return "#D97706";
    }
    return "#DC2626";
}

initializeLikeButton();
displayLikesCount();
populateDishDetails();
populateDishComments();