const searchBoxElem = document.getElementById("query");
const searchButton = document.querySelector('.action-search');
const resultsContainerElem = document.getElementById("results-movies");
const errorContainer = document.getElementById("error");

// Buttons for filtering and sorting
const allButton1 = document.getElementById("all1");
const filterButtonYear1 = document.getElementById("2000");
const filterButtonYear2 = document.getElementById("2010");
const sortButton = document.getElementById("sortAtoZ");
const sortButton2 = document.getElementById("sortZtoA");

searchButton.addEventListener("click", whenButtonClicked);
let filterDate;
let filterType;

async function whenButtonClicked(event) {
    const movies = await searchForMovies(searchBoxElem.value);

    let movieResults = await createMovieResults(movies);

    // Display all results if button is clicked
    allButton1.addEventListener("click", async (ev) => {
      movieResults = await createMovieResults(movies);

      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
      createCollapsibles();
    })

    // Display results in alphabetical order if button clicked
    sortButton.addEventListener("click", async (ev) => {
      movies.sort(sortAtoZ);
      movieResults = await createMovieResults(movies);

      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
      createCollapsibles();
    })

    // Display results in reverse alphabetical order if button clicked
    sortButton2.addEventListener("click", async (ev) => {
      movies.sort(sortAtoZ);
      movies.reverse();
      movieResults = await createMovieResults(movies);

      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
      createCollapsibles();
    })

    // Filter results by release date if any filter buttons clicked
    let moviesByDate;
    filterButtonYear1.addEventListener("click", async (ev) => {
      filterDate = 2000;
      moviesByDate = movies.filter(filterReleaseDate);

      movieResults = await createMovieResults(moviesByDate);
      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
      createCollapsibles();
    })

    filterButtonYear2.addEventListener("click", async (ev) => {
      filterDate = 2010;
      moviesByDate = movies.filter(filterReleaseDate);

      movieResults = await createMovieResults(moviesByDate);      
      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
      createCollapsibles();
    })

    clearResultsElem(resultsContainerElem);
    populateResultsElem(resultsContainerElem, movieResults);
    createCollapsibles();
}

// Creates collaspsible div for movie overview
function createCollapsibles() {
  var coll = document.getElementsByClassName("collapse");

  var i;
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;

      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

// Searches for list of movies given query string and returns array of objects
async function searchForMovies(query) {
  const movieResults = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=e665bb78bcfd68799e240988f1797c70&query=${query}`
  );
  const movieResultsJson = await movieResults.json();
  return movieResultsJson.results;
}

// Searches for details of movie given movie ID and returns array of objects
async function getTitleDetails(id) {
    const titleDetailResults = await fetch(
    `https://api.watchmode.com/v1/title/movie-${id}/details/?apiKey=Zwqu2xO4lyR8BvyulNzZe8ImTxZij4zUoMnZO5W2&append_to_response=sources`
    );

    const titleDetailResultsJson = await titleDetailResults.json();
    return titleDetailResultsJson;
}

// Sorts alphabetically by movie title
function sortAtoZ(movie1, movie2) {
  const title1 = movie1.title.toLowerCase(); // ignore upper and lowercase
  const title2 = movie2.title.toLowerCase(); // ignore upper and lowercase
  if (title1 < title2) {
    return -1;
  }
  if (title1 > title2) {
    return 1;
  }
  return 0;
}

// Filters movies by selected date
function filterReleaseDate(movie) {
    var year = parseInt(movie.release_date);
    return year >= filterDate;
}

// Creates HTML elements for displaying movie results
async function createMovieResults(movieResultsJson) {  
    // Creates error results if no movies found
    if (movieResultsJson.length == 0) {
      clearResultsElem(errorContainer);
      let resultElem = document.createElement("div");
      resultElem.classList.add("error");
      resultElem.append("No movies matched with the given input, please try again\n");
      errorContainer.append(resultElem);
    }
    return movieResultsJson.map((movie, i) => {
      // HTML elements  
      clearResultsElem(errorContainer);
      let resultElem = document.createElement("div");
      resultElem.classList.add("result-movie");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");
      p.classList.add("date")
      const img = document.createElement("img");
      const overviewButton = document.createElement("button");
      overviewButton.classList.add("collapse");
      const div = document.createElement("div");
      div.classList.add("text");

      h3.append(movie.title);
      resultElem.append(h3);

      img.src = 'https://image.tmdb.org/t/p/w200' + movie.poster_path;
      img.alt = 'Image of ' + movie.title;
      resultElem.append(img);

      // Appends error message if no release date available
      if (movie.release_date.length == 0) {
        p.append("Release Date: Not Available");
      } else {
        p.append("Release Date: " + movie.release_date);
      }
      resultElem.append(p);

      overviewButton.append("Read Movie Overview");
      resultElem.append(overviewButton);

      // Appends error message if no overview available
      if (movie.overview.length == 0) {
        div.append("Movie overview not available")
      } else {
        div.append(movie.overview);
      }
      resultElem.append(div);

      // Gets title details for each movie in array suing second API
      // and then creates results for title details
      // getTitleDetails(movie.id).then(data => {
      //   createTitleDetailResults(data, resultElem);
      // })

      return resultElem;
    });
}

// Creates HTML elements for displaying title details of movie
function createTitleDetailResults(titleDetails, resultElem) {
    const p = document.createElement("p");
    p.classList.add("rating");
    const p2 = document.createElement("p");
    p2.classList.add("sources");
    const a = document.createElement("a");

    // Appends error message if no title details availabel for movie
    if (!titleDetails.success) {
      p.append("User Rating (Out of 10): Not Available");
      p2.append("Sources: Not available");
      resultElem.append(p);
      resultElem.append(p2)
      return;
    }

    // Appends error message if no user rating available
    if (titleDetails.user_rating == null) {
      p.append("User Rating (Out of 10): Not Available");
    } else {
      p.append("User Rating (Out of 10): " + titleDetails.user_rating);
    }

    // Appends error message if no sources available
    // else create list of links to sources, making sure not to add duplicates
    if (titleDetails.sources.length == 0) {
      p2.append("Sources: Not available");
    } else {
      p2.append("Sources: ");
      for (var i = 0; i < titleDetails.sources.length; i++) {
        if (i != titleDetails.sources.length-1 && titleDetails.sources[i].source_id != titleDetails.sources[i+1].source_id) {
          var name = titleDetails.sources[i].name;
          var url = titleDetails.sources[i].web_url;
    
          const a = document.createElement("a");
          var link = document.createTextNode(name);
          a.appendChild(link);
          a.title = name;
          a.href = url;
          p2.appendChild(a);
          p2.append(", ")
        }
      }
    }

    resultElem.append(p);
    resultElem.append(p2)
}

function clearResultsElem(resultContainer) {
    Array.from(resultContainer.childNodes).forEach((child) => {
      child.remove();
    });
  }
  
  function populateResultsElem(resultContainer, ResultElem) {
    resultContainer.append(...ResultElem);
}