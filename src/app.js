require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Fetch random movie image
async function getRandomMovieImage() {
    const tmdbApiKey = process.env.API_KEY;
    const randomPage = Math.floor(Math.random() * 500) + 1;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&page=${randomPage}`);
        const movies = response.data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const imageUrl = `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`;
        console.log("Fetched Background Image URL:", imageUrl); // Log the URL
        return imageUrl;
    } catch (error) {
        console.error("Error fetching movie image:", error);
        return null; // Handle errors gracefully
    }
}

app.get("/", async (req, res) => {
    const backgroundImage = await getRandomMovieImage();
    res.render("index", { title: "The Movie Map", backgroundImage });
    console.log("Background Image:", backgroundImage);
});

app.get("/api/movies", async (req, res) => {
    const { country } = req.query;
    try {
        const tmdbApiKey = process.env.API_KEY;
        
        // Fetch country code
        const countryResponse = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
        const countryCode = countryResponse.data[0].cca2;

        // Fetch movies from TMDB
        const moviesResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&sort_by=popularity.desc&include_adult=false&with_origin_country=${countryCode}`);
        console.log("Movies Response Data:", moviesResponse.data);
        res.json(moviesResponse.data);
    } catch (error) {
        console.error("Error fetching movie data:", error.response.data || error.message)
        res.status(500).send("Error fetching movie data");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
