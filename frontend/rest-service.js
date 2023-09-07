
const endpoint = "http://127.0.0.1:3000";

async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const artists = await response.json();
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

async function updateArtist(
  id,
  name,
  birthdate,
  activeSince,
  genres,
  labels,
  website,
  description,
  image) {

    //new object to replace old version of data
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
  };
  const json = JSON.stringify(artistToUpdate);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "PUT",
    body: json,
  });
    return response;
}

async function deleteArtist(artistObject) {
  const id = artistObject.id;
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
    return response;
}

// async function favoriteArtist(id){
//   const response = await fetch(`${endpoint}/artists/${id}`, {
//     method: "PATCH"
//   });
//   return response;
// }
// replaced by localstorage methods for multi-user compatability

export { getArtists, createArtist, updateArtist, deleteArtist};
