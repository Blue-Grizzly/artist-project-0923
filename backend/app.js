import fs from "fs/promises";
import express, { query } from "express";
import cors from "cors";
import connection from "./database.js";

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

function getAllArtists(request, response) { //responds with all artists
    const query = `SELECT * FROM artists`;
    connection.query(query,
        function(error, results, fields){
            response.json(results);
        }  
    );
}

function getArtist(request, response) { //responds with the artist with the provided id 
    const query =  `SELECT * FROM artists WHERE artistid=${request.params.artistid}`;

    connection.query(query, (error, results, fields)=>{
        if(error){
            console.log(error);
        }  else{            
            response.json(results)[0];
            //position 0 to not get an array
        }
    });

}
function postArtist(request, response) { //posts the artist object sent from the front end
    const artist = request.body;
    const query = `INSERT INTO artists(artistid, name, image, birthday, activeSince, labels, website, genres, description) values(?,?,?,?,?,?,?,?,?);`;
    const values = [ ,artist.name, artist.image, artist.birthday, artist.activeSince, artist.labels, artist.website, artist.genres, artist.description];
    connection.query(query, values, (error, results, fields)=>{
        if(error){    
        console.log(error);
        }else{    
        response.json(results);
        }
        });
}

function updateArtist(request, response) {
    const param = request.params.artistid;
    const artist = request.body;
    const query = "UPDATE artists SET name=?, image=?, birthday=?, activeSince=?, labels=?, website=?, genres=?, description=? WHERE artistid=?;";
    const values = [artist.name, artist.image, artist.birthday, artist.activeSince, artist.labels, artist.website, artist.genres, artist.description, param];

    connection.query(query, values, (error, results, fields)=> {
        if(error){
            console.log(error);
        } else{
            response.json(results);
        }
    });
 }

function deleteArtist(request, response) { //delete
    const param = request.params.artistid;
    const query = "DELETE FROM artists WHERE artistid=?;";
    const value = [param];
    connection.query(query, value, (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            response.json(result);
        }
    });
}


app.listen( port, () =>{
    console.log("server running");
});