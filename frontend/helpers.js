import { artistList } from "./script.js";

function searchByName(searchValue) { //searching for all artist names that contains the search of the user
  searchValue = searchValue.toLowerCase().trim();
  return artistList.filter(artist => artist.name.toLowerCase().includes(searchValue));
}

function sortByOption(list) { //sorts depending on what sort option the user chooses
  const sortValue = document.querySelector("#sortby").dataset.filterValue;
  if(sortValue){
    if (sortValue === "name") {
        return list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortValue === "genre") {
        return list.sort((a, b) => a.genres.toString().localeCompare(b.genres.toString()));
      } else if (sortValue === "activeSinceOld") {
        return list.sort((a, b) => a.activeSince - b.activeSince);
      } else if (sortValue === "activeSinceNew") {
          return list.sort((a, b) => b.activeSince - a.activeSince);
      } else{
        return list;
      }
  } else{
    return list;
  }
}

function filterByGenre(list) { //filters for the genre chosen by the user
  const filterValue = document.querySelector("#filterby").dataset.filterValue;
  if(filterValue != "filterall"){
  let filteredList = list.filter((artist) =>
    artist.genres.toString().toLowerCase().includes(filterValue));

    if(filteredList.length !== 0){
      return filteredList
    } else{
      return filteredList=[];
    }
  } else {
    return list;
  }
}

function filterFavorites(list){ // filters favorites ony
  const filterValue = document.querySelector("#favorites").dataset.filterValue;
    let filteredList = list.filter((artist)=> artist.id in localStorage); //checks if artist id exists as a key in localstorage
    if (filterValue == "all" || !filterValue){
        return list;
    } else if(filteredList.length == 0){
        return filteredList =[];
    } else{
        return filteredList;
    }
}

  

export { filterByGenre, sortByOption, searchByName, filterFavorites};