/*  page creation script*/
const { Calendar } = window.VanillaCalendarPro;
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





/* Clander script for reminder date and time */
const options = {
    inputMode: true,
    positionToInput: 'auto',
    onChangeToInput: function (self) {
      if (!self.context.inputElement) return;
      if (self.context.selectedDates[0]) {
        self.context.inputElement.value = self.context.selectedDates[0];
        
        self.hide();
      } else {
        self.context.inputElement.value = '';
      }
    },
  };
  
  
const calendarInput = new Calendar('#reminder-calander', options);
calendarInput.init();





