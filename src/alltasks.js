let search = document.querySelector(".search")
let searchItem = document.querySelector(".search-item");
const searchButtonSearch = document.querySelector(".search-button-search")
const searchButtonBancel = document.querySelector(".search-button-cancel");
const searchButton = document.querySelector(".search-button");
const main = document.querySelector("main");


searchButton.addEventListener("click", () => {
    searchButton.classList.toggle("search-open")
    main.classList.toggle("search")
    search.classList.toggle("show")
})



