import fs from "fs/promises";
import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

const port = 3000;

app.get("/", (request, response)=>{
    response.end("Node.js Vanilla Toos REST API ");
});

app.get("/artists", async (request, response)=>{
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);

    if (!artists){
        response.status(404).json({ error: "No artists found!"})
    }else {
    response.json(artists);
    }
});


app.post("/artists", async (request, response)=>{
    const newArtist = request.body
    newArtist.id = new Date().getTime();
    newArtist.favorite = false;
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);
    if (!artists){
        response.status(400).json({ error: "Can't post empty list!"});
    }else if((Object.keys(request.body).length != 10)){
        // ^finds number of keys/attributes in object and tests if they match the correct amount (9)
        response.status(400).json({ error: "Incorrect number of artist attributes!"});
    }else  if(artists.find(artist => artist.name.toLowerCase() == newArtist.name.toLowerCase())){
        response.status(400).json({ error: "Artist already exists!"});
    }else{
        artists.push(newArtist);
        await fs.writeFile("data.json", JSON.stringify(artists));
        response.json(artists);
        }
});


app.get("/artists/:artistid", async (request, response)=>{
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);
    const param = request.params.artistid;
    const result = artists.find( artist => Number(artist.id) === Number(param));
    if (!result){
        response.status(404).json({ error: `No artist found with id: ${param}!`});
    }else {
        response.json(result);
    }
});

app.put("/artists/:artistid", async(request, response)=>{
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);
    const param = request.params.artistid;
    const newArtist = artists.filter(artist => Number(artist.id) !== Number(param))
    newArtist.push(request.body);
   
   
   
   
   
    if (newArtist == artists){
        response.status(404).json({ error: `No artist found with id: ${param}!`});
    }else if(Object.keys(request.body).length != 10){ 
        response.status(400).json({ error: "Incorrect number of artist attributes!"});    
    } else {
        await fs.writeFile("data.json", JSON.stringify(newArtist));
        response.json(newArtist);
        }
});

app.delete("/artists/:artistid", async(request, response)=>{
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);
    const param = request.params.artistid;
    // const result = artists.find( artist => Number(artist.id) === Number(param));
    // artists.splice(artists.indexOf(result), 1);
    const newArtist = artists.filter(artist => Number(artist.id) !== Number(param))
    if(newArtist == artists){
        response.status(404).json({ error: `No artist found with id: ${param}!`})
    }else {
        await fs.writeFile("data.json", JSON.stringify(newArtist));
        response.json(newArtist);
    }
});

app.patch("/artists/:artistid", async (request, response)=>{
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);
    const param = request.params.artistid;
    const result = artists.find( artist => Number(artist.id) === Number(param));

    if (!result){
        response.status(404).json({ error: `No artist found with id: ${param}!`});
    } else {
        result.favorite = !result.favorite

        await fs.writeFile("data.json", JSON.stringify(artists));
        response.json(result.favorite);
        }
});

app.listen( port, () =>{
    console.log("server running");
});
