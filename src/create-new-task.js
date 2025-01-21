/*  page creation script*/

/* Declaring input variable */
import {getFileCoverType} from "./utils/functions.js";
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
      

      let newCategory = document.createElement("label");
      newCategory.setAttribute("for","business");
      newCategory.innerHTML =  `
        <input type="radio" id=${taskCategory} name="categories" value=${taskCategory} class="category-selector" checked>
         ⚙️ ${taskCategory}
      `;

      categories.append(newCategory)

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

reminderTimeSelector.addEventListener("change",() => {
  reminderTime = reminderTimeSelector.value;
});


addSubtaskBtn.addEventListener('click', () => {

  let subtask = {
    title: subTaskDescription.value,
    done : false
  }

  let newSubtask = document.createElement("div");
  newSubtask.classList.add("sub-task");
  newSubtask.setAttribute("data-taskid", subTasks.length);
  newSubtask.innerHTML =  `
    <p>${subTaskDescription.value}</p>
    <button class="delete-sub-task-btn" id=task-${subTasks.length} data-taskid=${subTasks.length} >remove</button>
  `;

  subTasks.push(subtask)
  
  document.querySelector(".sub-tasks-list").append(newSubtask)
  subTaskDescription.value = '';

  /* ADD event listener to the new delete  */
  document.getElementById(`task-${(subTasks.length) - 1}`).addEventListener("click", deleteTask);


})


uploadFileBtn.addEventListener('click', () => {
  let file = fileAttachment.files[0];

  let newAttachment = document.createElement("div");
  newAttachment.classList.add("attachment");
  newAttachment.setAttribute("data-attachmentid",`${attachments.length}`);

  newAttachment.innerHTML = `
      <div class="attachment-icon"><img src="${getFileCoverType(file.type)}" alt="attachment"></div> 
      <p>${file.name}</p>

      <button class="delete-attachment-btn" id="file-${attachments.length}" data-attachmentid=${attachments.length}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>

  `;

  attachments.push(file)
  document.querySelector(".attachments").append(newAttachment);
  document.getElementById(`file-${attachments.length - 1}`).addEventListener("click", deleteFile);
  fileAttachment.value = '';

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

/* Event listener for deleting subtack when added */
function deleteTask(event) {
  subTasks.splice(event.target.dataset.taskid, 1)

  document.querySelector(".sub-tasks-list").innerHTML = "";

  subTasks.forEach((task,index) => {

    let newSubtask = document.createElement("div");
    newSubtask.classList.add("sub-task");
    newSubtask.setAttribute("data-taskid", index);
    newSubtask.innerHTML =  `g
    <p>${task.title}</p>
    <button class="delete-sub-task-btn" id=task-${index} data-taskid=${index} >remove</ button>
    `

      document.querySelector(".sub-tasks-list").append(newSubtask)

      document.getElementById(`task-${index}`).removeEventListener("click", deleteTask);
      document.getElementById(`task-${index}`).addEventListener("click", deleteTask);

    ; });
}


/* Event listener for deleting file when added */
function deleteFile(event) {
  document.querySelector(".attachments").querySelectorAll(".attachment").forEach((file) => {

    if(file.dataset.attachmentid === event.currentTarget.dataset.attachmentid) {
      attachments.splice(event.currentTarget.dataset.attachmentid, 1);

      document.querySelector(".attachments").innerHTML = "";
      attachments.forEach( (attachment,index) => {
        let newAttachment = document.createElement("div");
        newAttachment.classList.add("attachment");
        newAttachment.setAttribute("data-attachmentid",`${index}`);
      
        newAttachment.innerHTML = `
            <div class="attachment-icon"><img src="${getFileCoverType(attachment.type)}" alt="attachment"></div> 
            <p>${attachment.name}</p>
      
            <button class="delete-attachment-btn" id="file-${index}" data-attachmentid=${index}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
      
        `;

        document.querySelector(".attachments").append(newAttachment);
        document.getElementById(`file-${index}`).removeEventListener("click", deleteFile);
        document.getElementById(`file-${index}`).addEventListener("click", deleteFile);

      })
      
    }
  });
  
}





