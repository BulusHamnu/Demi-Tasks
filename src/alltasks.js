let search = document.querySelector(".search")
let searchItem = document.querySelector(".search-item");
const searchButtonSearch = document.querySelector(".search-button-search")
const searchButtonBancel = document.querySelector(".search-button-cancel");
const searchButton = document.querySelector(".search-button");
const header = document.querySelector("header");


searchButton.addEventListener("click", () => {
    searchButton.classList.toggle("search-open")
    header.classList.toggle("show-search")
    search.classList.toggle("show")
})



