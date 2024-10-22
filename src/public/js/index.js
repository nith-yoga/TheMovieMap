document.addEventListener ('DOMContentLoaded', () => {
    // DEFINING VARIABLES
    const submitBtn = document.getElementById("submit");
    const nextBtn = document.getElementById("next");
    const userInput = document.getElementById("userin");
    const movieTitle = document.getElementById("movie-title");
    const movieOverview = document.getElementById("movie-overview");
    const moviePoster = document.getElementById("movie-poster");

    let movies = [];

    // LISTENERS

        // Submit Button
    submitBtn.addEventListener('click', () => {
        const country = userInput.value.trim();
        if (country) {
            getMovieRecommendation(country);
            nextBtn.style.display = "block";
        } else {
            alert("Please enter a country name.");
        }
    });

        // Next Button
    nextBtn.addEventListener('click', () => {
        if (movies.length > 0) {
            displayRandomMovie();
        }
    });

    // FUNCTION TO GET MOVIE REC
    async function getMovieRecommendation(country) {
        try {
            const response = await fetch(`/api/movies?country=${country}`);
            const moviesData = await response.json();
            if (moviesData.results && moviesData.results.length > 0) {
                movies = moviesData.results;
                displayRandomMovie();
            } else {
                movieTitle.textContent = "No movies found for this country.";
                movieOverview.textContent = "";
            }
    } catch (error) {
        console.error("Error fetching movie data:", error);
        movieTitle.textContent = "Error retrieving movie information.";
        movieOverview.textContent = "";
    }
}
    // FUNCTIONS TO RANDOMIZE & DISPLAY MOVIES
    function displayRandomMovie() {
        if (movies.length === 0) return;
        const randomIndex = Math.floor(Math.random() * movies.length);
        const randomMovie = movies[randomIndex];
        displayMovie(randomMovie);
    }

    function displayMovie(movie) {
        movieTitle. textContent = movie.title;
        movieOverview.textContent = movie.overview;
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        moviePoster.style.display = "block";
    }
})