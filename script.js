const searchBoxElem = document.getElementById("query");
const searchButton = document.querySelector('.action-search');
const resultsContainerElem1 = document.getElementById("results-movies");
// const resultsContainerElem2 = document.getElementById("results-providers");

const allButton1 = document.getElementById("all1");
const filterButtonYear1 = document.getElementById("2000");
const filterButtonYear2 = document.getElementById("2010");

// const allButton2 = document.getElementById("all2");
// const freeButtom = document.getElementById("free");
// const subButton = document.getElementById("sub");
// const tveButton = document.getElementById("tve");
// const purchaseButton = document.getElementById("purchase");
// console.log(searchBoxElem);
// console.log(searchButton);

searchButton.addEventListener("click", whenButtonClicked);
// displayProviderResults();
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

async function getTitleDetails(id) {
    const titleDetailResults = await fetch(
    `https://api.watchmode.com/v1/title/movie-${id}/details/?apiKey=BxUJaSFDaGsqgjtUsqdzGD2BVdP6E3Wgzi0jXdmg&append_to_response=sources`
    );

    const titleDetailResultsJson = await titleDetailResults.json();
    console.log("title detail results");
    console.log(titleDetailResultsJson);
    return titleDetailResultsJson;
}

function filterReleaseDate(movie) {
    // console.log(movie.release_date);
    // console.log(filterDate);

    var year = parseInt(movie.release_date);
    // console.log(year);

    // console.log(year >= filterDate);
    return year >= filterDate;
}

// function filterProvType(provider) {
//   return provider.type === filterType;
// }

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

      getTitleDetails(movie.id).then(data => {
        createTitleDetailResults(data, resultElem);
      })

      return resultElem;
    });
}

function createTitleDetailResults(titleDetails, resultElem) {
    const h5 = document.createElement("h5");
    const p = document.createElement("p");
    p.classList.add("sources");
    const a = document.createElement("a");

    if (titleDetails.user_rating == null) {
      h5.append("User Rating (Out of 10): Not Available");
    } else {
      h5.append("User Rating (Out of 10): " + titleDetails.user_rating);
    }

    if (titleDetails.sources.length == 0) {
      p.append("Sources: Not available");
    } else {
      p.append("Sources: ");
      for (var i = 0; i < titleDetails.sources.length; i++) {
        if (i != titleDetails.sources.length-1 && titleDetails.sources[i].source_id != titleDetails.sources[i+1].source_id) {
          console.log("true");
  
          var name = titleDetails.sources[i].name;
          var url = titleDetails.sources[i].web_url;
    
          console.log(name);
          const a = document.createElement("a");
          var link = document.createTextNode(name);
          a.appendChild(link);
          a.title = "hello";
          a.href = url;
          p.appendChild(a);
          p.append(", ")
        }
      }
    }

    resultElem.append(h5);
    resultElem.append(p)
}

function clearResultsElem(resultContainer) {
    Array.from(resultContainer.childNodes).forEach((child) => {
      child.remove();
    });
  }
  
  function populateResultsElem(resultContainer, ResultElem) {
    resultContainer.append(...ResultElem);
}