const auth = "";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
const more = document.querySelector(".more");
let page = 1;
let fetchLink;
let currentSearch;

//Event listener
searchInput.addEventListener("input", updateInput);
//event listner for the search form
//on submit button click, call the search photo request function, passing in the search query from search box
form.addEventListener("submit", (e) => {
  //Use e.preventDefault to stop the form from automatically sumbitting when the submit button is clicked
  //This is done so that we can use the searchPhotos function to call the fetch api
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", laodMore);

function updateInput(e) {
  //obtain the search query in search box from user input
  //assign search query value to searchValue variable
  console.log(e.target.value);
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  //convert/parse the response data into JavaScript object using .json()
  //.json() which takes Response stream and resolves it to json object once its done
  const jsonData = await dataFetch.json();
  console.log(jsonData);
  return jsonData;
}

//Display the pictures obatined from api onto webpage
function displayPictures(jsonData) {
  //jsonData.photos , photos is the attribute, in the Object returned from the API fetch, containing the array of photos
  jsonData.photos.forEach((photo) => {
    //console.log(photo);
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `<img src=${photo.src.large}>
    <div class="gallery-info">
    <p>${photo.photographer}</p>
    <a href=${photo.src.original}>Download</a>
    </div>`;
    gallery.appendChild(galleryImg);
  });
}

//Function to fetch the list of photos from the pexels api
async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const dataFetch = await fetchApi(fetchLink);
  console.log(dataFetch);
  displayPictures(dataFetch);
}

async function searchPhotos(query) {
  //clear the picture gallery first then display the search values
  clear();
  //add the search query to the api request2
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15`;
  const dataFetch = await fetchApi(fetchLink);

  displayPictures(dataFetch);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function laodMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  displayPictures(data);
}
curatedPhotos();

//add a link to show small/medium/large pictures
