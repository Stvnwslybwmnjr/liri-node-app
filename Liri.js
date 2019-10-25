require("dotenv").config();

var keys = require("./keys.js");

//console.log(keys)

var Spotify = require("node-spotify-api");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var [, , command, value] = process.argv; //array destructuring

var moment = require('moment');
moment().format();


//================== READING AND WRITING FUNCTIONS ARE DEFINED HERE ====================================================================
function appendLog(text) {
  fs.appendFile("log.txt", text, function(err) {
    console.log("COMMAND:  " + command);

    console.log("QUERY:  " + value);

    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }

    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
      console.log("log.txt updated");
      console.log(
        "======================================== Search Results ===================================================="
      );
    }
  });
}

function readRandom() {
    fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    // console.log(data);
    // spotifyIT(data);
    let randomArr = data.split(", ")
    command = randomArr[0];
    value = randomArr[1];
    switchCommand();
    appendLog(" Do What It Says was used.\n");
  });
}

// ============================== Switch Command Selector is here ============================================================
function switchCommand(){
switch (command) {
  case "spotify-this-song":
    spotifyIT(value);
    appendLog(` COMMAND: ${command} QUERY: ${value} \n`);
    console.log(
      "============================================================================================================"
    );
    break;
  case "movie-this":
    if (value == null) {
      movieThis("Mr. Nobody");
    } else {
      movieThis(value);
    }
    appendLog(` COMMAND: ${command} QUERY: ${value} \n`);
    console.log(
      "============================================================================================================"
    );
    break;
  case "concert-this":
    concertThis(value);
    appendLog(` COMMAND: ${command} QUERY: ${value} \n`);
    console.log(
      "============================================================================================================"
    );
    break;
  case "do-what-it-says":
    readRandom();
    break;
  default:
    console.log(`Type in one of the following commands: 
    'spotify-this-song' followed by a song title,
    'movie-this' followed by a movie title,
    'concert-this' followed by a musical artist, 
     or simply enter 'do-what-it-says' `);
}};
switchCommand();
// ================================ Command Functions are defined here ======================================================
function spotifyIT(song) {
  spotify.search({ type: "track", query: song || "The sign" }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    if (song == null) {
      console.log("Artist",
      JSON.stringify(data.tracks.items[4].album.artists[0].name, null, 10))
      console.log(
        "Album",
        JSON.stringify(data.tracks.items[4].album.name, null, 10)
      );
      console.log("Song", JSON.stringify(data.tracks.items[4].name, null, 10));
      console.log(
        "Preview Song!",
        JSON.stringify(data.tracks.items[4].preview_url, null, 10))
    } else {
      for (let i = 0; i < data.tracks.items.length; i++) {
        console.log(
          "Artist(s)",
          JSON.stringify(data.tracks.items[i].album.artists[0].name, null, 10)
        );
      }
      console.log("==============================================================================")
      console.log("Artist",
      JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 10))
      console.log(
        "Album",
        JSON.stringify(data.tracks.items[0].album.name, null, 10)
      );
      console.log("Song", JSON.stringify(data.tracks.items[0].name, null, 10));
      console.log(
        "Preview Song!",
        JSON.stringify(data.tracks.items[0].preview_url, null, 10)
      );
    }

  
  });
}

function movieThis(movie) {
  let movieAPIkey = keys.omdbkey.id;

  var axios = require("axios");
  
  axios
    .get(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=${movieAPIkey}`)
    .then(function(response) {
      console.log("Movie Title:             " + response.data.Title);
      console.log("Year Released:           " + response.data.Year);
      console.log("IMDB Rating:             " + response.data.imdbRating);
      console.log("Country of Production:   " + response.data.Country);
      console.log("Language:                " + response.data.Language);
      console.log("Plot:                    " + response.data.Plot);
      console.log("Cast:                    " + response.data.Actors);
    })
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function concertThis(artist) {
  let concertkey = keys.concertkey.id;
  var axios = require("axios");
  axios
    .get(
      `https://rest.bandsintown.com/artists/${artist}/events?app_id=${concertkey}`
    )
    .then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        // console.log(i)
        if (response.data[i].venue.region == "AZ") {
          console.log("Venue: " + response.data[i].venue.name);
          console.log("Country: " + response.data[i].venue.country);
          console.log("State: " + response.data[i].venue.region);
          console.log("CITY: " + response.data[i].venue.city);
          console.log(`EVENT DATE: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`);
        }
      }
    })
    .catch(function(error) {
      console.log("THIS IS AN ERROR===============================================")
      if (error.response) {
       
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        
        console.log(error.request);
      } else {
       
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
