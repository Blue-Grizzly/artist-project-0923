
const endpoint = "http://127.0.0.1:3000";

async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  const artists = Object.keys(data).map(key => ({ id: key, ...data[key] })); //does the same as the old prepareData function but in 1 line
  return artists;
}

async function createArtist(
  name,
  birthdate,
  activeSince,
  genres,
  labels,
  website,
  description,
  image) {
  const newArtist = {
    name: name,
    birthdate: birthdate,
    activeSince: activeSince,
    genres: genres,
    labels: labels,
    website: website,
    description: description,
    image: image
  };

  const json = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: json,
  });
  return response;
}

//  Updates an existing character
async function updateArtist(
  id,
  name,
  birthdate,
  activeSince,
  genres,
  labels,
  website,
  description,
  image,
  favorite) {
  // Character object we update
  const artistToUpdate = {
    id: id,
    name: name,
    birthdate: birthdate,
    activeSince: activeSince,
    genres: genres,
    labels: labels,
    website: website,
    description: description,
    image: image,
    favorite: favorite
  };
  // Converts the JS object to JSON string
  const json = JSON.stringify(artistToUpdate);
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  const response = await fetch(`${endpoint}/artists/${id}`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "PUT",
    body: json,
  });
  // Checks if response is ok - if the response is successful
    return response;
}

async function deleteArtist(artistObject) {
  const id = artistObject.id;
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
    return response;
}

async function favoriteArtist(id){
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "PATCH"
  });
  return response;
}

export { getArtists, createArtist, updateArtist, deleteArtist, favoriteArtist};
