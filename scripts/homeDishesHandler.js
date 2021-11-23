
function populateRecentPostedDishes(data) {
    let postSection = document.getElementById('home-posts');
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

function fetchDishes(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/getRecentPostedDishes',
        success: function(res) {
            // console.log(JSON.stringify(res));
            // console.log('Response', res);
            console.log(typeof res);
            data = JSON.parse(res);
            populateRecentPostedDishes(data["data"]);
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })
}

fetchDishes();