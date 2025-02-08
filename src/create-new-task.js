/*  page creation script*/

/* Declaring input variable */
import { taskMangerDb } from "../db/data-module.js";
import {getFileCoverType} from "./utils/functions.js";
let taskName;
let aboutTask;
let taskPriority;
let taskDueDate ;
let taskCategory ;
let reminderType ;
let reminderDay ;
let newTaskStatus = "🔲 in-completed";
let reminderTime ;
let enabled = false;
let subTasks = [];
let attachments = [];
let allCategories = [];
const db = new taskMangerDb();

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




/* This render all the categories from db */

db.getAllCategories().then( data => {
  if(data.length > 0) {
    allCategories = data;
    renderCustomCategory(false);
    renderCategorySettings();
  }

})


function renderCustomCategory(c) {
  categories.innerHTML = ``;

  allCategories.forEach((category,index) => {
    let newCategory = document.createElement("label");
      newCategory.setAttribute("for",`${category.name}`);
      newCategory.innerHTML =  `
        <input type="radio" id="${category.name}" name="categories" value="${category.name}" class="category-selector" ${index === allCategories.length - 1 && c? "checked" : ""}>
        ${category.name}
      `;

      categories.append(newCategory);
  })

  let customCategory = document.createElement("label");
  customCategory.setAttribute("for",`other`);
  customCategory.innerHTML = `
    <input type="radio" id="other" name="categories" value="other" class="category-selector">
      add custom
  `;

  categories.append(customCategory);


}

/* end of render */


 


let url = new URL(window.location.href).searchParams.get("editid");
let taskId = parseInt(url);

/* this will only trigger when the user is coming from the tasks page and want to edit task */
if(taskId) {
  db.getTask(taskId).then((task) => {

    // initialize all variable with current task data
    taskName = task.title;
    aboutTask = task.description;
    taskPriority = task.priority;
    taskDueDate = task.dueDate;
    taskCategory = task.category;
    reminderType = task.reminderDetails.type;
    reminderDay = task.reminderDetails.date;
    reminderTime = task.reminderDetails.time;
    enabled = task.reminder;
    subTasks = task.subTasks;
    attachments= task.attachment;
    newTaskStatus = task.status;

    //display current task data
    taskTitle.value = task.title;
    taskDescription.value = task.description
    dueDateSelector.value = task.dueDate
    document.querySelectorAll(".task-piyority-selector").forEach( category => { if(category.value === task.priority){ category.checked = true}});

    let reminderDetails = task.reminderDetails;

    if (enabled) {
      addReminderToogle.checked = true;
      addReminderToogle.click();
      document.getElementById("reminder-type").querySelectorAll("option").forEach( option => {

        if(option.value === reminderDetails.type.trim()) { option.selected = true; }
      }) 

      reminderCalander.value = reminderDetails.date;
      reminderTimeSelector.value = reminderDetails.time;
    }

    let categoryFound = false;
    document.querySelectorAll(".category-selector").forEach( category => { 
      if(category.value === task.category) {
        category.checked = true;
        categoryFound = true;
      }

    })

    if(!categoryFound) {
      let newCategory = document.createElement("label");
      newCategory.setAttribute("for","business");
      newCategory.innerHTML =  `
        <input type="radio" id=${task.category} name="categories" value=${task.category} class="category-selector" checked>
        ${task.category}
      `;

      categories.append(newCategory)
    }


    subTasks.forEach( (subtask,index) => {

      let newSubtask = document.createElement("div");
      newSubtask.classList.add("sub-task");
      newSubtask.setAttribute("data-taskid", index);
      newSubtask.innerHTML =  `
        <p>${subtask.title}</p>
        <button class="delete-sub-task-btn" id=task-${index} data-taskid=${index} >remove</button>
      `;
      
      document.querySelector(".sub-tasks-list").append(newSubtask);
      document.getElementById(`task-${index}`).addEventListener("click", deleteTask);
    });
    

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
      document.getElementById(`file-${index}`).addEventListener("click", deleteFile);
    });

    });


}





/* categories setting */

document.querySelector(".category-setting-btn").addEventListener("click", (event) => {
  document.querySelector(".category-settings").classList.toggle("show");
  categories.classList.toggle("hide");
  event.currentTarget.classList.toggle("showing");

  document.querySelector(".promt-message").classList.remove("show-promt-message");
  document.querySelector(".promt-message-overlay").classList.remove("show-overlay");

});


function renderCategorySettings() {
  document.querySelector(".all-categories").innerHTML = "";

  allCategories.forEach((category,index) => {
  
    let newCategory = document.createElement("label");
    newCategory.setAttribute("for",category.name);
    newCategory.innerHTML =  `
      ${category.name}
  
      <svg class="delete-category" id="delete-category-${index}" data-categoryid="${category.id}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    `;
  
    document.querySelector(".all-categories").appendChild(newCategory)
    document.querySelector(`#delete-category-${index}`).addEventListener("click", deleteCategory)
  
  })


}


function deleteCategory(event) {
  let category = event.currentTarget.parentElement.getAttribute("for");

  let ele = event.currentTarget;
  let categoryId = parseInt(ele.dataset.categoryid);
  let categoryNum = parseInt(ele.id.split("-")[2]);

  db.getAllTasks(category).then( tasks => {
    if(tasks.length > 0) {
    alert(`there ${tasks.length === 1? "is" : "are"} ${tasks.length} tasks link to this category you need to change it before you can delete it!`);

    } else {
      document.querySelector(".promt-message").classList.add("show-promt-message");
      document.querySelector(".promt-message-overlay").classList.add("show-overlay");
      document.querySelector("#delete-task-btn").setAttribute("data-categoryIds",`${categoryId}-${categoryNum}`);

    }
  });

  

}

/* event listener for deletion comfirmation btn */

document.querySelector(".promt-message-btn-cont").addEventListener("click", (event) => {
  if(event.target.id == "cancel-delete-btn") {
    document.querySelector(".promt-message").classList.remove("show-promt-message");
    document.querySelector(".promt-message-overlay").classList.remove("show-overlay");

  } else if (event.target.id == "delete-task-btn") {
    let categoryId = parseInt(event.target.dataset.categoryids.split("-")[0]);
    let categoryNum = parseInt(event.target.dataset.categoryids.split("-")[1]); 

    db.deleteCategory(categoryId).then(message => {
        if(message === "success") {    
          allCategories.splice(categoryNum,1);
          renderCustomCategory(false);
          renderCategorySettings();

          document.querySelector(".promt-message").classList.remove("show-promt-message");
          document.querySelector(".promt-message-overlay").classList.remove("show-overlay");

          alert("Category deleted");
    
        } else {
          document.querySelector(".promt-message").classList.remove("show-promt-message");
          document.querySelector(".promt-message-overlay").classList.remove("show-overlay");

          alert("Failed to delete category");
        }
    
      });
  }

});






/* event for all input */
taskTitle.addEventListener("change",() => { taskName = taskTitle.value });

taskDescription.addEventListener("change",() => { aboutTask = taskDescription.value })

taskPiyorities.addEventListener('click',(event) => { taskPriority = event.target.value; },true);

dueDateSelector.addEventListener("change", () => {taskDueDate = dueDateSelector.value;} );

categories.addEventListener("click",(event) => {

  if(event.target.value === "other") {

    customCategoryInput.classList.add("show");

    return ;
  }

  customCategoryInput.classList.remove("show");
  taskCategory = event.target.value;

  

})



/* event listeneer for custom categorybtn */
customCategoryBtn.addEventListener("click",addCustomCategory)
function addCustomCategory(event) {
  taskCategory = "⚙️ " + customCategoryInputbox.value;
  let newCategory = {
    name : taskCategory
  }

  allCategories.push(newCategory);
  db.addNewCategory(newCategory).then(message => {
    if(message === "success") {
      // categories.innerHTML = ``;

      db.getAllCategories().then( data => {
        if(data.length > 0) {
          allCategories = data;
          renderCustomCategory(true);
          renderCategorySettings();
        }
      
      });

    } else {
      alert("Failed to add category, try again");
    }

  })


  
  customCategoryInputbox.value = '';

  customCategoryInput.classList.remove("show")
}


reminderSelector.addEventListener("change",() => {
  reminderType = reminderSelector.value.trim();
  
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

  const blob = new Blob([file], { type: file.type });
  let newBlob = {
    name: file.name,
    type: file.type,
    lastModified: Date.now(),
    fileData: blob
  }

  attachments.push(newBlob)

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

  /* checking for empty field */
if(!taskName){
  taskTitle.classList.add("error");
  alert("Please add a task name");
  return
} else {
  taskTitle.classList.remove("error");
}
if(!aboutTask) {
  taskDescription.classList.add("error");
  alert("Please add a description");
  return
}else {
  taskDescription.classList.remove("error");
}
if(!taskPriority) {
  taskPiyorities.classList.add("error");
  alert("Please add a task priority");
  return
} else {
  taskPiyorities.classList.remove("error");
}
if(!taskDueDate){
  dueDateSelector.classList.add("error");
  alert("Please add a task due date");
  return
} else {
  dueDateSelector.classList.remove("error");
}
if(!taskCategory) {
  categories.classList.add("error");
  alert("Please select a task category");
  return
} else {
  categories.classList.remove("error");
}



let newTask = {
  title : taskName,
  description : aboutTask  ,
  dueDate : taskDueDate  ,
  priority : taskPriority  ,
  status : newTaskStatus,
  category : taskCategory ,
  reminder : enabled,
  reminderDetails : {
      type : `${reminderType?reminderType: "daily"}` ,
      date : `${reminderDay? reminderDay : new Date().toISOString().split("T")[0] }`, 
      time : `${reminderTime? reminderTime : "10:00" }`,
  },
  subTasks : subTasks,
  attachment : attachments
}


// checks for taskId if yes then executes edit task function else creates task
if (taskId) {
  db.updateTask(taskId,newTask).then( message => {
    if(message === "task updated") {
      alert("Task updated");
      setTimeout(() => {window.location.href = "alltasks.html";},300)
    } else {
      alert("Failed to add task try saving again");
    }
  })

} else {
  db.addTask(newTask)
    .then( message => {
      if(message === 'saved') {
        document.querySelectorAll("input").forEach((input) => {input.value = ""});
        document.querySelectorAll("textarea").forEach((textarea) => {textarea.value = ""});

        alert("Added task");
        setTimeout(() => {window.location.href = "alltasks.html";},300)
      } else {
        alert("Failed to add task try saving again");
      }
    })
}

  
}

/* Event listener for deleting subtack when added */
function deleteTask(event) {
  subTasks.splice(event.target.dataset.taskid, 1)

  document.querySelector(".sub-tasks-list").innerHTML = "";

  subTasks.forEach((task,index) => {

    let newSubtask = document.createElement("div");
    newSubtask.classList.add("sub-task");
    newSubtask.setAttribute("data-taskid", index);
    newSubtask.innerHTML =  `
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












