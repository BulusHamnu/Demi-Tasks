/* menu and header code */
const themeSwitch = document.querySelector('.theme-switch');




// Dark Mode Switcher
if(body.classList.contains("dark-theme")) {
    themeSwitch.classList.add("dark-mode")
} else {
    themeSwitch.classList.remove("dark-mode")
}

themeSwitch.addEventListener("click", () => {
    if(body.classList.contains("dark-theme")) {
        localStorage.setItem("demy-tasks-theme", "light");
        body.classList.remove("dark-theme");
        themeSwitch.classList.remove("dark-mode")

    } else {
        localStorage.setItem("demy-tasks-theme", "dark");
        body.classList.add("dark-theme");
        themeSwitch.classList.add("dark-mode")

    }

})

