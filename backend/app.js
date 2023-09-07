import fs from "fs/promises";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const port = 3000;

app.get("/", (request, response)=>{
    response.end("Access artist DB at /artists");
});

app.get("/artists", getAllArtists);

app.get("/artists/:artistid", getArtist)

app.post("/artists",  postArtist);

app.put("/artists/:artistid", updateArtist);

app.delete("/artists/:artistid", deleteArtist);

app.patch("/artists/:artistid", favoriteArtist);

async function getAllArtists(request, response) {
    const artists = await readArtistDB();

    if (!artists) {
        response.status(404).json({ error: "No artists found!" });
    } else {
        response.json(artists);
    }
}

async function getArtist(request, response) {
    const artists = await readArtistDB();
    const param = request.params.artistid;
    const result = findArtist(artists, param);
    if (!result) {
        response.status(404).json({ error: `No artist found with id: ${param}!` });
    } else {
        response.json(result);
    }
}

async function postArtist(request, response) {
    const artists = await readArtistDB();

    if (!request.body) {
        response.status(400).json({ error: "No artist recieved!" });

    } else if ((Object.keys(request.body).length != 8)) {
        // ^finds number of keys/attributes in object and tests if they match the correct amount (9)
        response.status(400).json({ error: "Incorrect number of artist attributes!" });

    } else if (artists.find(artist => artist.name.toLowerCase() == request.body.name.toLowerCase())) {
        response.status(400).json({ error: "Artist already exists!" });

    } else {
        pushNewArtist(request, artists);
        response.json(artists);
    }
}

function pushNewArtist(request, artists) {
    request.body.id = getNewId(artists);
    request.body.favorite = false;
    artists.push(request.body);
    writeArtistDB(artists);
}

async function updateArtist(request, response) {
    const artists = await readArtistDB();
    const param = request.params.artistid;
    const newList = removeArtist(artists, param);

    if (newList == artists) {
        response.status(404).json({ error: `No artist found with id: ${param}!` });

    } else if (Object.keys(request.body).length != 10) {
        response.status(400).json({ error: "Incorrect number of artist attributes!" });

    } else {
        newArtist.push(request.body);
        writeArtistDB(artists);
        response.json(newArtist);
    }
}

async function deleteArtist(request, response) {
    const artists = await readArtistDB();
    const param = request.params.artistid;
    const newArtists = removeArtist(artists, param);
    if (newArtists == artists) {
        response.status(404).json({ error: `No artist found with id: ${param}!` });
    } else {
        writeArtistDB(newArtists);
        response.json(newArtists);
    }
}

async function favoriteArtist(request, response) {
    const artists = await readArtistDB();
    const param = request.params.artistid;
    const result = findArtist(artists, param);

    if (!result) {
        response.status(404).json({ error: `No artist found with id: ${param}!` });
    } else {
       
        result.favorite = !result.favorite;

        writeArtistDB(artists);
        response.json(result.favorite);
    }
}

async function readArtistDB() {
    return JSON.parse(await fs.readFile("data.json"));
}

function findArtist(artists, param){
    return artists.find( artist => Number(artist.id) === Number(param));
}

function writeArtistDB(artists){
    fs.writeFile("data.json", JSON.stringify(artists));
}

function removeArtist(artists, param){
   return artists.filter(artist => Number(artist.id) !== Number(param));
}

function getNewId(artists){
    artists.sort((a, b) => b.id - a.id)
    return artists[0].id+1;
}

app.listen( port, () =>{
    console.log("server running");
});