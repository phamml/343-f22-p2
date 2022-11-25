const searchBoxElem = document.getElementById("query");
const searchButton = document.querySelector('.action-search');
const resultsContainerElem = document.getElementById("results");

const allButton = document.getElementById("all");
const filterButton1 = document.getElementById("2000");
const filterButton2 = document.getElementById("2010");
// console.log(searchBoxElem);
// console.log(searchButton);

searchButton.addEventListener("click", whenButtonClicked);
let filterDate;

async function whenButtonClicked(event) {
    console.log("testing");
    console.log(searchBoxElem.value);   

    const movies = await searchForMovies(searchBoxElem.value);
    console.log("movies=");
    console.log(movies);

    let movieResults = await createMovieResults(movies);
    console.log(movieResults);

    allButton.addEventListener("click", async (ev) => {
      console.log("show all");
      movieResults = await createMovieResults(movies);

      clearResultsElem();
      populateResultsElem(movieResults);
    })

    let moviesByDate;
    filterButton1.addEventListener("click", async (ev) => {
      console.log("filter 2000");
      filterDate = 2000;
      moviesByDate = movies.filter(filterReleaseDate);
      console.log(moviesByDate);

      movieResults = await createMovieResults(moviesByDate);
      console.log(movieResults);  

      clearResultsElem();
      populateResultsElem(movieResults);
    })

    filterButton2.addEventListener("click", async (ev) => {
      console.log("filter 2010");
      filterDate = 2010;
      moviesByDate = movies.filter(filterReleaseDate);
      console.log(moviesByDate);

      movieResults = await createMovieResults(moviesByDate);
      console.log(movieResults); 
      
      clearResultsElem();
      populateResultsElem(movieResults);
    })

    clearResultsElem();
    populateResultsElem(movieResults);

}

async function searchForMovies(query) {
  const movieResults = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=e665bb78bcfd68799e240988f1797c70&query=${query}`
  );
  console.log(movieResults);
  const movieResultsJson = await movieResults.json();
  //   const truncatedTo10 = rhymeResultsJson.slice(0, 10);
  console.log(movieResultsJson.results);
  return movieResultsJson.results;
}

function filterReleaseDate(movie) {
    console.log(movie.release_date);
    console.log(filterDate);

    var year = parseInt(movie.release_date);
    console.log(year);

    console.log(year >= filterDate);
    return year >= filterDate;
}

async function createMovieResults(movieResultsJson) {  
    return movieResultsJson.map((movie, i) => {
      let resultElem = document.createElement("div");
      resultElem.classList.add("result");
      const h3 = document.createElement("h3");
      const h4 = document.createElement("h4");
      // const img = document.createElement("img");

      h3.append(movie.title);
      resultElem.append(h3);

      h4.append("Release Date: " + movie.release_date);
      resultElem.append(h4);

      resultElem.append(movie.overview);

      // img.src = '/txIt41UgDBJsZ7W33bhXjdqUIv8.jpg';
      // resultElem.append(img);
      return resultElem;
    });
}

function clearResultsElem() {
    Array.from(resultsContainerElem.childNodes).forEach((child) => {
      child.remove();
    });
  }
  
  function populateResultsElem(rhymeResultsElems) {
    resultsContainerElem.append(...rhymeResultsElems);
}