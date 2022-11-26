const searchBoxElem = document.getElementById("query");
const searchButton = document.querySelector('.action-search');
const resultsContainerElem1 = document.getElementById("results-movies");
const resultsContainerElem2 = document.getElementById("results-providers");

const allButton1 = document.getElementById("all1");
const filterButtonYear1 = document.getElementById("2000");
const filterButtonYear2 = document.getElementById("2010");

const allButton2 = document.getElementById("all2");
const freeButtom = document.getElementById("free");
const subButton = document.getElementById("sub");
const tveButton = document.getElementById("tve");
const purchaseButton = document.getElementById("purchase");
// console.log(searchBoxElem);
// console.log(searchButton);

searchButton.addEventListener("click", whenButtonClicked);
displayProviderResults();
let filterDate;
let filterType;

async function whenButtonClicked(event) {
    // console.log("testing");
    // console.log(searchBoxElem.value);   

    const movies = await searchForMovies(searchBoxElem.value);
    console.log("movies=");
    console.log(movies);

    let movieResults = await createMovieResults(movies);
    console.log(movieResults);

    allButton1.addEventListener("click", async (ev) => {
      // console.log("show all");
      movieResults = await createMovieResults(movies);

      clearResultsElem(resultsContainerElem1);
      populateResultsElem(resultsContainerElem1, movieResults);
    })

    let moviesByDate;
    filterButtonYear1.addEventListener("click", async (ev) => {
      // console.log("filter 2000");
      filterDate = 2000;
      moviesByDate = movies.filter(filterReleaseDate);
      // console.log(moviesByDate);

      movieResults = await createMovieResults(moviesByDate);
      clearResultsElem(resultsContainerElem1);
      populateResultsElem(resultsContainerElem1, movieResults);
    })

    filterButtonYear2.addEventListener("click", async (ev) => {
      // console.log("filter 2010");
      filterDate = 2010;
      moviesByDate = movies.filter(filterReleaseDate);
      // console.log(moviesByDate);

      movieResults = await createMovieResults(moviesByDate);      
      clearResultsElem(resultsContainerElem1);
      populateResultsElem(resultsContainerElem1, movieResults);
    })

    clearResultsElem(resultsContainerElem1);
    populateResultsElem(resultsContainerElem1, movieResults);
}

async function displayProviderResults() {
    const providers = await getProviders();
    console.log("providers");
    console.log(providers);

    let providerResults = await createProviderResults(providers);
    clearResultsElem(resultsContainerElem2);
    populateResultsElem(resultsContainerElem2, providerResults);

    allButton2.addEventListener("click", async (ev) => {
      console.log("all2");
      providerResults = await createProviderResults(providers);
      clearResultsElem(resultsContainerElem2);
      populateResultsElem(resultsContainerElem2, providerResults);
    })

    freeButtom.addEventListener("click", async (ev) => {
      console.log("free");
      filterType = "free";
      providersByType = providers.filter(filterProvType);
      // console.log(moviesByDate);

      providerResults = await createProviderResults(providersByType);      
      clearResultsElem(resultsContainerElem2);
      populateResultsElem(resultsContainerElem2, providerResults);
    })

    subButton.addEventListener("click", async (ev) => {
      console.log("sub");
      filterType = "sub";
      providersByType = providers.filter(filterProvType);
      // console.log(moviesByDate);

      providerResults = await createProviderResults(providersByType);      
      clearResultsElem(resultsContainerElem2);
      populateResultsElem(resultsContainerElem2, providerResults);
    })

    tveButton.addEventListener("click", async (ev) => {
      console.log("tve");
      filterType = "tve";
      providersByType = providers.filter(filterProvType);
      // console.log(moviesByDate);

      providerResults = await createProviderResults(providersByType);      
      clearResultsElem(resultsContainerElem2);
      populateResultsElem(resultsContainerElem2, providerResults);
    })

    purchaseButton.addEventListener("click", async (ev) => {
      console.log("purchase");
      filterType = "purchase";
      providersByType = providers.filter(filterProvType);
      // console.log(moviesByDate);

      providerResults = await createProviderResults(providersByType);      
      clearResultsElem(resultsContainerElem2);
      populateResultsElem(resultsContainerElem2, providerResults);
    })
}

async function searchForMovies(query) {
  const movieResults = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=e665bb78bcfd68799e240988f1797c70&query=${query}`
  );
  console.log("movie results");
  console.log(movieResults);
  const movieResultsJson = await movieResults.json();
  // console.log(movieResultsJson.results);
  return movieResultsJson.results;
}

async function getProviders() {
  const providerResults = await fetch(
    `https://api.watchmode.com/v1/sources/?apiKey=bMVg1po77MviaBmggWxWaAgFrAjOYxfkacTB5WQW`
  );
  console.log("provider results");
  console.log(providerResults);
  const providerResultsJson = await providerResults.json();
  console.log(providerResultsJson);
  return providerResultsJson;
}

function filterReleaseDate(movie) {
    // console.log(movie.release_date);
    // console.log(filterDate);

    var year = parseInt(movie.release_date);
    // console.log(year);

    // console.log(year >= filterDate);
    return year >= filterDate;
}

function filterProvType(provider) {
  return provider.type === filterType;
}

async function createMovieResults(movieResultsJson) {  
    return movieResultsJson.map((movie, i) => {
      let resultElem = document.createElement("div");
      resultElem.classList.add("result-movie");
      const h3 = document.createElement("h3");
      const h4 = document.createElement("h4");
      const img = document.createElement("img");
      const br = document.createElement("br");

      h3.append(movie.title);
      resultElem.append(h3);

      h4.append("Release Date: " + movie.release_date);
      resultElem.append(h4);

      img.src = 'https://image.tmdb.org/t/p/w200' + movie.poster_path;
      img.alt = 'Image of ' + movie.title;
      resultElem.append(img);

      resultElem.append(br);
      resultElem.append(movie.overview);
      return resultElem;
    });
}

function createProviderResults(providerResultsJson) {
    return providerResultsJson.map((provider, i) => {
      let resultElem = document.createElement("div");
      resultElem.classList.add("result-provider");
      const h3 = document.createElement("h3");
      const h4 = document.createElement("p");

      h3.append(provider.name);
      h4.append("Type: " + provider.type);
      resultElem.append(h3);
      resultElem.append(h4);

      return resultElem;
    });
}

function clearResultsElem(resultContainer) {
    Array.from(resultContainer.childNodes).forEach((child) => {
      child.remove();
    });
  }
  
  function populateResultsElem(resultContainer, ResultElem) {
    resultContainer.append(...ResultElem);
}