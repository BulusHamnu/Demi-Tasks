/*  page creation script*/
const addReminderToogle = document.getElementById("yes")
const removeReminderToogle = document.getElementById("no")
const reminderOptionConst = document.querySelector(".reminder-selector")
const customCategoryInput = document.querySelector(".custom-category")
const addOtherCategoryToogle = document.querySelector("#other")
const taskDateSection = document.querySelector(".task-date-section") 
const taskCategories = document.querySelector(".task-categories")





/* shows an input when user want to add other category */
addOtherCategoryToogle.addEventListener("click", (event) => {
  if(event.target.checked) {
    customCategoryInput.classList.toggle("show")
    taskCategories.classList.toggle("show")
  }
})


/* shows a reminder option when user want to add reminder */
addReminderToogle.addEventListener("click", () => {
  reminderOptionConst.classList.add("add-reminder")
  taskDateSection.classList.add("add-height")
})
removeReminderToogle.addEventListener("click", () => {
  reminderOptionConst.classList.remove("add-reminder");
  taskDateSection.classList.remove("add-height")
})









