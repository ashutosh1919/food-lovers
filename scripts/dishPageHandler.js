


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
            // console.log(JSON.stringify(res));
            // console.log('Response', res);
            console.log(res);
            populateDishComments();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });
}

function populateCommentCards(data){
    let commentSection = document.getElementById('dish-comments');

    for(let i = 0; i < data.length; i++){
        commentDetails = data[i];

        // Comment card
        let commentCard = document.createElement('div');
        commentCard.className = 'flex flex-row w-full p-2';

        // Commentor details
        [profileUrl, fullName] = fetchCommentorDetails(commentDetails["OWNER_ID"]);

        // Commentor Profile;
        let commentorImage = document.createElement('img');
        commentorImage.className = 'w-14 md:w-20 h-14 md:h-20 mr-2 object-cover rounded-full cursor-pointer';
        if(profileUrl === 'null'){
            commentorImage.src = '../assets/images/default-profile.jpeg';
        }
        else{
            commentorImage.src = profileUrl;
        }

        // Commentor Name-Comment Div
        let commentorNestedDiv = document.createElement('div');
        commentorNestedDiv.className = 'ml-2';

        let commentorName = document.createElement('h2');
        commentorName.className = 'text-gray-800 text-lg font-medium mb-2 cursor-pointer';
        commentorName.textContent = fullName;
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
            console.log(res);
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
        return [profileUrl, fullName];
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
                // console.log(JSON.stringify(res));
                // console.log('Response', res);
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

populateDishComments();