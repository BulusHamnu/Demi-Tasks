/*  page creation script*/
const { Calendar } = window.VanillaCalendarPro;
const addReminder = document.getElementById("yes")
const removeReminder = document.getElementById("no")
const reminderSelector = document.querySelector(".reminder-selector")
const customCategoryInput = document.querySelector(".custom-category")
const addOtherCategory = document.querySelector("#other")


addOtherCategory.addEventListener("click", (event) => {
  if(event.target.checked) {
    customCategoryInput.classList.toggle("show")
  }
})



addReminder.addEventListener("click", () => {
  reminderSelector.classList.add("add-reminder")
})
removeReminder.addEventListener("click", () => {
  reminderSelector.classList.remove("add-reminder")
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





