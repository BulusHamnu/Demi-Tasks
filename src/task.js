/* getting and deplaying task data */
import { taskMangerDb } from "../db/data-module.js";
import {changeDateFormat} from "./utils/functions.js";
import {getFileCoverType} from "./utils/functions.js";
const taskTitle = document.querySelector(".task-header");
const taskDescription = document.querySelector(".task-description");
const taskDueDate = document.querySelector(".task-due-date");
const taskCategory = document.querySelector(".task-categorie-type");
const taskPriority = document.querySelector(".task-priority-code");
const subTaskCont = document.querySelector(".sub-tasks");
const progressText = document.querySelector(".progress-text");
const fileCont = document.querySelector(".file-cont");
const addNewSubTask = document.querySelector(".add-sub-task");
const taskProgressBar = document.querySelector(".progress-bar");


const db = new taskMangerDb()

let url = new URL(window.location.href).searchParams.get("taskid");
let taskId = parseInt(url);

if(taskId) {
    db.getTask(taskId)
    .then((task) => {
        console.log(task)
        document.title = task.title;
        renderTaskDetails(task);

    addNewSubTask.setAttribute("data-taskid", `${task.id}`)
    
    addNewSubTask.addEventListener("click", () => {
        document.querySelector('.input-new-task').classList.add('show');
    });

});
} else {
    console.log("No task found");
    document.querySelector("main").innerHTML = "<h1>No task found</h1>";
    window.location.href = "alltasks.html";
}





/* function */
/* rendering tasks */
function renderTaskDetails(task) {
    taskTitle.innerHTML = task.title;
    taskDescription.innerHTML = task.description;
    taskDueDate.innerHTML =  changeDateFormat(task.dueDate);
    taskCategory.setAttribute("data-category-type", task.category)
    taskCategory.innerHTML = task.category;
    taskPriority.setAttribute("data-priority-type", task.priority)
    taskPriority.innerHTML = task.priority;

    renderSubTask(task.subTasks,task)

    if (task.attachment && task.attachment.length > 0) {
        task.attachment.forEach( file => {

            const fileDiv = document.createElement("a");
            fileDiv.classList.add("task-file");
            fileDiv.setAttribute("target","_blank")
            const blob = new Blob([file.fileData], { type: file.type });
            const fileUrl = URL.createObjectURL(blob);

            fileDiv.href = fileUrl;
            fileDiv.innerHTML = `
                <div class="file-cover">
                <img src="${getFileCoverType(file.type)}" alt="${file.name}">
                </div>
                ${file.name}
            `;

            fileCont.appendChild(fileDiv);
        })
    }
}


/* rendering subtask */
function renderSubTask(subtasks,task) {
    subTaskCont.innerHTML = "";
    let dx = taskProgressBar.offsetWidth;

    //update the progress bar text
    let doneSubtask = task.subTasks.filter(d => d.done === true);
    progressText.innerHTML = `${doneSubtask.length} of ${task.subTasks.length} completed`;

    //update the progress bar
    let perBar = dx / task.subTasks.length;
    let barFill = perBar * doneSubtask.length;
    taskProgressBar.style.setProperty("--progressBarWidth",`${barFill}px`);


    //setting the status based on the amount of subtasks completed
    if (doneSubtask.length === task.subTasks.length) {
        if(task.status !== "✅ completed") {
            db.updateTaskEntry("status","✅ completed",task.id);
        }
        
    } else if (doneSubtask.length > 0 ) {
        if(task.status !== "🔄 in-progress") {
            db.updateTaskEntry("status","🔄 in-progress",task.id);
        }

    } else {
        db.updateTaskEntry("status","🔲 in-completed",task.id)
    }

    if (subtasks && subtasks.length > 0) {
        subtasks.forEach((subtask,index) => {
            const subTaskDiv = document.createElement("div");
            subTaskDiv.classList.add("task");
            subTaskDiv.innerHTML = `
                <input type="checkbox" class="subtask-check" data-subtaskid="${index}" data-taskid="${task.id}" ${subtask.done? "checked" : ""}>
                <label for="sub-task-${index}">${subtask.title}</label>

                <button data-taskid="${task.id}" data-subtaskid="${index}" class="delete-subtask-btn" >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            `;

            subTaskCont.appendChild(subTaskDiv);
        });

        document.querySelectorAll(".subtask-check").forEach( check => {
            check.addEventListener("change", subTaskDone)
        });

        document.querySelectorAll(".delete-subtask-btn").forEach(btn => {
            btn.addEventListener("click", deleteSubtask)
        });

    } else {
        document.querySelector(".sub-tasks").innerHTML = `
            <p>No Subtasks Found</p>
        `
    }
}


/* checking and unchecking subtask */
function subTaskDone(event) {
    let taskId = parseInt(event.target.dataset.taskid);
    let subTaskId = parseInt(event.target.dataset.subtaskid);

    if(event.target.checked) {
        db.updateInnerTaskEntry("subTasks",true,taskId,subTaskId).then(task => {
            renderSubTask(task.subTasks,task);
        })
    } else {
        db.updateInnerTaskEntry("subTasks",false,taskId,subTaskId).then(task => {
            renderSubTask(task.subTasks,task);
        })
    }

}

/* deleting subtask */
function deleteSubtask(event) {
    let taskId = parseInt(event.currentTarget.dataset.taskid);
    let subTaskId = parseInt(event.currentTarget.dataset.subtaskid);

    db.deleteSubTask(taskId,subTaskId).then((task) => {
        renderSubTask(task.subTasks,task);
    })

}

/* ADD new subtasks */
document.querySelector(".add-subtask").addEventListener("click",addNewSubtasks)
function addNewSubtasks(event) {
    let subTaskTitle = document.querySelector("#new-subtask-input");
    db.addSubTask(taskId,subTaskTitle.value).then((task) => {
        renderSubTask(task.subTasks,task)

        document.querySelector('.input-new-task').classList.remove('show');
        subTaskTitle.value = "";
    });
}

/* close subtask modal */
document.querySelector(".close-subtask-modal").addEventListener("click", () => {
    document.querySelector('.input-new-task').classList.remove('show');
})




