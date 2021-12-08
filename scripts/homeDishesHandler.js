
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function populateRecentPostedDishes(data) {
    let postSection = document.getElementById('home-posts');
    removeAllChildNodes(postSection);

    for(let i = 0; i < data.length; i++){
        let dish = data[i];

        // Card div
        let postCard = document.createElement('div');
        postCard.id = dish["DISH_ID"];
        postCard.className = 'rounded overflow-hidden shadow-lg cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 ...';
        postCard.onclick = () => {
            window.localStorage.setItem('WATCH_DISH_ID', dish["DISH_ID"]);
            window.location.href = 'dish.html'; 
        }

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
            data = JSON.parse(res);
            populateRecentPostedDishes(data["data"]);
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })
}


const throttledFunction = (func, limit) => {
    let flag = true;
    return function(element) {
        if(flag){
            func(element);
            flag = false;
            setTimeout(() => { flag = true; }, limit);
        }
    }
}

function onSearchChange(element){
    // console.log('Hi');
    if(element.target.value.trim() === ''){
        // console.log('Hi2');
        fetchDishes();
        return;
    }
    let pattern = "%" + element.target.value + "%";
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/searchDishes',
        data: JSON.stringify({"pattern": pattern}),
        success: function(res) {
            data = JSON.parse(res);
            if(data["data"].length === 0){
                document.getElementById('home-no-posts').style.display = 'block';
                populateRecentPostedDishes([]);
            }
            else{
                document.getElementById('home-no-posts').style.display = 'none';
                populateRecentPostedDishes(data["data"]);
            }
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })
}

const throttledSearch = throttledFunction(onSearchChange, 500);

let searchBar = document.getElementById('home-dish-search-bar');
searchBar.addEventListener('input', throttledSearch);

fetchDishes();