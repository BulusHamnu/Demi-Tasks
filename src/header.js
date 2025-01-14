/* menu and header code */
const themeSwitch = document.querySelector('.theme-switch');

themeSwitch.addEventListener("click", () => {
    document.body.classList.toggle('dark-theme');
    
    // localStorage.setItem('theme', document.body.classList.contains('dark-theme')? 'dark' : 'light');
})

