const searchBoxElem = document.getElementById("query");
const searchButton = document.querySelector('.action-search');
// console.log(searchBoxElem);
// console.log(searchButton);

searchButton.addEventListener("click", whenButtonClicked);

async function whenButtonClicked(event) {
    console.log("testing");
    console.log(searchBoxElem.value);   
}