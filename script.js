const searchBoxElem = document.getElementById("query");
const searchButton = document.querySelector('.action-search');
const resultsContainerElem = document.getElementById("results");
// console.log(searchBoxElem);
// console.log(searchButton);

searchButton.addEventListener("click", whenButtonClicked);

async function whenButtonClicked(event) {
    console.log("testing");
    console.log(searchBoxElem.value);   

    const movies = await searchForMovies(searchBoxElem.value);
    console.log(movies);

    const movieResults = await createMovieResults(movies);
    console.log(movieResults);

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

async function createMovieResults(movieResultsJson) {  
    return movieResultsJson.map((movieTitle, i) => {
      let resultElem = document.createElement("div");
      resultElem.classList.add("result");
      const h3 = document.createElement("h3");
      const h4 = document.createElement("h4");

      h3.append(movieTitle.title);
      resultElem.append(h3);
      h4.append("Release Date: " + movieTitle.release_date);
      resultElem.append(h4);
      resultElem.append(movieTitle.overview);
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