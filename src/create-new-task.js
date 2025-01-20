/*  page creation script*/

/* Declaring input variable */
let taskName;
let aboutTask;
let taskPriority;
let taskDueDate ;
let taskCategory ;
let reminderType ;
let reminderDay ;
let reminderTime ;
let enabled = false;
let subTasks = [];
let attachments = [];




/* Getting all input */
const addReminderToogle = document.getElementById("yes")
const removeReminderToogle = document.getElementById("no")
const reminderOptionConst = document.querySelector(".reminder-selector")
const customCategoryInput = document.querySelector(".custom-category")
const addOtherCategoryToogle = document.querySelector("#other")
const taskDateSection = document.querySelector(".task-date-section") 
const taskCategories = document.querySelector(".task-categories")
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskPiyorities = document.querySelector(".piyorities");
const dueDateSelector = document.getElementById("task-due-date");
const categories = document.querySelector(".categories");
const reminderSelector = document.getElementById("reminder-type");
const reminderCalander = document.getElementById("reminder-calander");
const reminderTimeSelector = document.getElementById("reminder-time");
const subTaskDescription = document.getElementById("sub-task-description");
const addSubtaskBtn = document.querySelector(".add-sub-task-btn");
const fileAttachment = document.getElementById("attachment-file");
const customCategoryInputbox = document.getElementById("custom-category-input");
const customCategoryBtn = document.getElementById("add-custom-category")
const uploadFileBtn = document.getElementById("upload-attachment");
const saveNewTaskBtn = document.getElementById("save-task-btn");
const cancelTaskBtn = document.getElementById("cancel-task-btn");




/* event for all input */
taskTitle.addEventListener("change",() => { taskName = taskTitle.value });

taskDescription.addEventListener("change",() => { aboutTask = taskDescription.value })

taskPiyorities.addEventListener('click',(event) => { taskPriority = event.target.value; },true);

dueDateSelector.addEventListener("change", () => {taskDueDate = dueDateSelector.value;} );

categories.addEventListener("click",(event) => {
  taskCategory = event.target.value;

  if(event.target.value === "other") {
    customCategoryBtn.addEventListener("click",() => {
      taskCategory = customCategoryInputbox.value
      customCategoryInputbox.value = '';
      console.log(taskCategory)

      event.target.checked = false;
      taskCategories.classList.remove("show")
      customCategoryInput.classList.remove("show")
    })
  }

})

reminderSelector.addEventListener("change",() => {
  reminderType = reminderSelector.value;
  
})

reminderCalander.addEventListener("change", () => {
  reminderDay = reminderCalander.value
} );

reminderTimeSelector.addEventListener("click",() => {
  reminderTime = reminderTimeSelector.value;
});


addSubtaskBtn.addEventListener('click', () => {

  let subtask = {
    title: subTaskDescription.value,
    done : false
  }

  subTasks.push(subtask)
  subTaskDescription.value = '';

})


fileAttachment.addEventListener('change', (event) => {
  let file = event.target.files[0];
  attachments.push(file)

});

uploadFileBtn.addEventListener('click', () => {
  console.log("Upload")
})

saveNewTaskBtn.addEventListener('click', () => {
  getTaskData ()
})

cancelTaskBtn.addEventListener('click', () => {
  window.location.href = 'allTasks.html';
})



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
  enabled = true;

})
removeReminderToogle.addEventListener("click", () => {
  reminderOptionConst.classList.remove("add-reminder");
  taskDateSection.classList.remove("add-height")
  enabled = false;

})




/* getting data from the page */

function getTaskData () {
  
let newTask = {
  title : taskName,
  description : aboutTask  ,
  dueDate : taskDueDate  ,
  priority : taskPriority  ,
  status : "in-completed",
  category : taskCategory  ,
  reminder : {
      enabled : enabled,
      type : ` ${reminderType? reminderType: "daily"}` ,
      date : reminderDay ,
      time : reminderTime
  },
  subTasks : subTasks,
  attachment : attachments
}
console.log(newTask)

}






