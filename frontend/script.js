import { filterByGenre, sortByOption, searchByName, filterFavorites } from "./helpers.js";
import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "./rest-service.js";

export let artistList = [];

window.addEventListener("load", initApp);

function initApp() {
  fetchArtists();

  // resets the datasets for sorting etc so the options reset correctly when you refresh the page
  document.querySelector("#sortby").dataset.filterValue = "";
  document.querySelector("#favorites").dataset.filterValue = "";
  document.querySelector("#filterby").dataset.filterValue = "";

  // event listeners for forms, sorting and so on
  document
    .querySelector("#create-artist-form")
    .addEventListener("submit", createArtistClicked);
  document
    .querySelector("#update-artist-form")
    .addEventListener("submit", updateArtistClicked);

  document.querySelector("#sortby")
    .addEventListener("change", (event) =>{
      document.querySelector("#sortby").dataset.filterValue = event.target.value;
      fetchArtists();
    });

  document.querySelector("#favorites").addEventListener("change", (event) => {
    document.querySelector("#favorites").dataset.filterValue = event.target.value;
    fetchArtists();
  }
  );

  document
    .querySelector("#input-search")
    .addEventListener("keyup", (event) =>
      showArtists(searchByName(event.target.value))
    );
  document
    .querySelector("#input-search")
    .addEventListener("search", (event) =>
      showArtists(searchByName(event.target.value))
    );
  document
    .querySelector("#filterby")
    .addEventListener("change", (event) => {
      document.querySelector("#filterby").dataset.filterValue = event.target.value;
      fetchArtists();
    });
}

function updateClicked(artistObject) {
  //saves the form in as a variable so easier to use below
  const updateForm = document.querySelector("#update-artist-form");

  //put the current version of the object into their corresponding  fields in the form

  updateForm.name.value = artistObject.name;
  updateForm.birthdate.value = artistObject.birthdate;
  updateForm.activeSince.value = artistObject.activeSince;
  updateForm.genres.value = artistObject.genres.join(", "); //separates the genre array into a string
  updateForm.labels.value = artistObject.labels.join(", ");
  updateForm.website.value = artistObject.website;
  updateForm.description.value = artistObject.description;
  updateForm.image.value = artistObject.image;

  //saves the id of the artist for later use
  updateForm.dataset.artistId = artistObject.id;

  //scrolls to the buttom of the page where the form is
  window.scrollTo({ top: 1000000, behavior: "smooth" }); //scroll to bottom

  console.log("Update button clicked!");
}


async function createArtistClicked(event) {
  event.preventDefault();
  
  // saves the data sent from the form in an object for posting
  const form = document.querySelector("#create-artist-form");
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value.split(", ");
  const labels = form.labels.value.split(", ");
  const website = form.website.value;
  const description = form.description.value;
  const image = form.image.value;
  const response = await createArtist(
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    description,
    image
  );
  if (response.ok) {
    //add scroll to top
    refreshArtistGrid();
  } else {
    console.log(response.status, response.statusText);
  }
}

async function updateArtistClicked(event) {
  event.preventDefault();
  const form = document.querySelector("#update-artist-form");
  // extract the values from inputs in the form
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value.split(", ");
  const labels = form.labels.value.split(", ");
  const website = form.website.value;
  const description = form.description.value;
  const image = form.image.value;
  const id = form.dataset.artistId;

  //new artist object for updating
  const response = await updateArtist(
    id,
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    description,
    image
  );
  if (response.ok) {
    refreshArtistGrid();
  } else {
    console.log(response.status, response.statusText);
  }
}

function deleteArtistClicked(artistObject) {
// shows the dialog to confirm deletion of the data
  document.querySelector("#delete-name").textContent = artistObject.name;
  document.querySelector("#dialog-delete-artist").showModal();
  document.querySelector("#delete-confirm").addEventListener("click", () => deleteArtistConfirm(artistObject));
  document.querySelector("#delete-cancel").addEventListener("click", (event) => cancelDeleteArtist(event));
}

function cancelDeleteArtist(event) {
  event.preventDefault();
  document.querySelector("#dialog-delete-artist").close();
}

async function deleteArtistConfirm(artistObject) {
  const response = await deleteArtist(artistObject);

  if (response.ok) {
    refreshArtistGrid();
    showDeleteFeedback();
  } else {
    console.log(response.status, response.statusText);
  }
}

async function fetchArtists(){
  let now = new Date().getTime();
  let lastTime;
  if (now - lastTime > 90000 || artistList.length === 0) { //to limit the amount of requests to aprox. once every 1.5 min
    lastTime = new Date().getTime();
    // records last time it fetched the data from the backend
    artistList = await getArtists(); 
    refreshArtistGrid();
  } else{
    refreshArtistGrid();
  }
}

function refreshArtistGrid() {
  window.scrollTo({ top: 0, behavior: "smooth" }); //scroll to top when grid refreshes
  const favoriteList = filterFavorites(artistList); 
  const filteredList = filterByGenre(favoriteList);
  const sortedList = sortByOption(filteredList);
  showArtists(sortedList); 
  //runs through all the applied filters and sorts and pass them for showing
}

function showArtists(artistList) { //loops through all artist objects and show them
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#artist-grid").innerHTML = "";
  document.querySelector("#create-artist-form").reset();
  document.querySelector("#update-artist-form").reset();
  if (artistList.length !== 0) {
    for (const artist of artistList) {
      showArtist(artist);
    }
  } else {
    document.querySelector("#artist-grid").insertAdjacentHTML("beforeend", /*html*/`
    <h2 id="search-error-msg"> No artists were found. Please try again.</h2>
    `);
    //tells the user when no data matched the search
  }

}

function showArtist(artistObject) {
  // html for each artist object
  const html = /*html*/ `
        <article class="grid-item">
        <div class="clickable">    
            <img src="${artistObject.image}" />
            <h3><b>${artistObject.name}</b></h3>
            <p>${artistObject.description}</p>
            <p>Genres: ${artistObject.genres}</p>
            <p>Website: <a href="${artistObject.website}"> ${artistObject.website}</a></p>
        </div>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
                <button class="btn-favorite">Favorite</button> 
            </div>
        </article>
    `;
  document.querySelector("#artist-grid").insertAdjacentHTML("beforeend", html);

  // adds favorite class on all objects added to the favorite list in localstorage
  if (getFavorite(artistObject.id)) {
    document.querySelector("#artist-grid article:last-child").classList.add("favorite");
  }

  // all click events on each grid item
  document.querySelector("#artist-grid article:last-child .clickable").addEventListener("click", () => {
    showArtistModal(artistObject);
  });
  document.querySelector("#artist-grid article:last-child .btn-delete")
    .addEventListener("click", () => deleteArtistClicked(artistObject));

  document.querySelector("#artist-grid article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(artistObject));

  document.querySelector("#artist-grid article:last-child .btn-favorite").
    addEventListener("click", () => artistFavoriteClick(artistObject));
}

function getFavorite(id){
  if(id in localStorage){ //checks if artist id exists as a key in localstorage which currently is only used for tracking favorites
    // find better solution later!!
    return true
   } else {
    return false;
   }
}



function showArtistModal(artistObject) {
  // inserts the data into the dialog window
  document.querySelector("#artist-image").src = artistObject.image;
  document.querySelector("#artist-name").textContent = artistObject.name;
  document.querySelector("#artist-birthdate").textContent = artistObject.birthdate;
  document.querySelector("#artist-activeSince").textContent = artistObject.activeSince;
  document.querySelector("#artist-labels").textContent = artistObject.labels;
  document.querySelector("#artist-website").textContent = artistObject.website;
  document.querySelector("#artist-website").href = artistObject.website;
  document.querySelector("#artist-genres").textContent = artistObject.genres;
  document.querySelector("#artist-description").textContent = artistObject.description;
  document.querySelector("#artist-modal").showModal();
}

async function artistFavoriteClick(artistObject) {
  // checks if the artist has already been favorited
  // if it has, it will be removed if it hasn't it wil be added
  if(getFavorite(artistObject.id)){
    localStorage.removeItem(artistObject.id);
  }else{
    localStorage.setItem(artistObject.id, true);
}
refreshArtistGrid();
  
  // replaced with localstorage solution for scalability
  // const response = await favoriteArtist(artistObject.id);
  // if (response.ok) {
  //   refreshArtistGrid();
  //   console.log("Artist added to favorites!");
  // } else {
  //   console.log(response.status, response.statusText);
  // }
}


