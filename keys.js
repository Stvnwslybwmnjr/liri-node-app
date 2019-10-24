console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdbkey = {
  id: process.env.OMDB_APIKEY
}

exports.concertkey = {
  id: process.env.CONCERT_API
}
