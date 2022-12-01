const searchBoxElem = document.getElementById("query");
const searchButton = document.querySelector('.action-search');
const resultsContainerElem = document.getElementById("results-movies");
// const resultsContainerElem2 = document.getElementById("results-providers");

const allButton1 = document.getElementById("all1");
const filterButtonYear1 = document.getElementById("2000");
const filterButtonYear2 = document.getElementById("2010");
const sortButton = document.getElementById("sortAtoZ");
const sortButton2 = document.getElementById("sortZtoA");

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

      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
    })

    sortButton.addEventListener("click", async (ev) => {
      // console.log("sort");
      movies.sort(sortAtoZ);
      movieResults = await createMovieResults(movies);

      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);

    })

    sortButton2.addEventListener("click", async (ev) => {
      movies.sort(sortAtoZ);
      movies.reverse();
      movieResults = await createMovieResults(movies);

      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);

    })

    let moviesByDate;
    filterButtonYear1.addEventListener("click", async (ev) => {
      filterDate = 2000;
      moviesByDate = movies.filter(filterReleaseDate);

      movieResults = await createMovieResults(moviesByDate);
      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
    })

    filterButtonYear2.addEventListener("click", async (ev) => {
      filterDate = 2010;
      moviesByDate = movies.filter(filterReleaseDate);

      movieResults = await createMovieResults(moviesByDate);      
      clearResultsElem(resultsContainerElem);
      populateResultsElem(resultsContainerElem, movieResults);
    })

    clearResultsElem(resultsContainerElem);
    populateResultsElem(resultsContainerElem, movieResults);

    createCollapsibles();
}

function createCollapsibles() {
  var coll = document.getElementsByClassName("collapse");
  console.log("content1");
  console.log(coll);
  console.log(coll.length);
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      console.log(this);
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      console.log("content");
      console.log(content);
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
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

function filterReleaseDate(movie) {
    var year = parseInt(movie.release_date);
    return year >= filterDate;
}

async function createMovieResults(movieResultsJson) {  
    return movieResultsJson.map((movie, i) => {
      let resultElem = document.createElement("div");
      resultElem.classList.add("result-movie");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");
      const img = document.createElement("img");
      // const br = document.createElement("br");
      const overviewButton = document.createElement("button");
      overviewButton.classList.add("collapse");
      const div = document.createElement("div");
      div.classList.add("text");


      h3.append(movie.title);
      resultElem.append(h3);

      if (movie.release_date.length === 0) {
        p.append("Release Date: Not Available");
      } else {
        p.append("Release Date: " + movie.release_date);
      }
      resultElem.append(p);

      img.src = 'https://image.tmdb.org/t/p/w200' + movie.poster_path;
      img.alt = 'Image of ' + movie.title;
      resultElem.append(img);

      // resultElem.append(br);

      overviewButton.append("Read Movie Overview");
      resultElem.append(overviewButton);

      if (movie.overview.length === 0) {
        // console.log("null");
        div.append("Movie overview not available")
      } else {
        div.append(movie.overview);
      }
      resultElem.append(div);

      // getTitleDetails(movie.id).then(data => {
      //   createTitleDetailResults(data, resultElem);
      // })

      return resultElem;
    });
}

function createTitleDetailResults(titleDetails, resultElem) {
    const p = document.createElement("p");
    const p2 = document.createElement("p");
    p2.classList.add("sources");
    const a = document.createElement("a");

    if (titleDetails.user_rating == null) {
      p.append("User Rating (Out of 10): Not Available");
    } else {
      p.append("User Rating (Out of 10): " + titleDetails.user_rating);
    }

    if (titleDetails.sources.length == 0) {
      p2.append("Sources: Not available");
    } else {
      p2.append("Sources: ");
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