import { taskMangerDb } from "../db/data-module.js";
import {changeDateFormat} from "../src/utils/functions.js";
let search = document.querySelector(".search");
let searchItem = document.querySelector(".search-item");
const taskGrid = document.querySelector(".tab-grid");
const searchButtonSearch = document.querySelector(".search-button-search")
const searchButtonBancel = document.querySelector(".search-button-cancel");
const searchButton = document.querySelector(".search-button");
const header = document.querySelector("header");
const statusTabs = document.querySelectorAll(".category-tab")
const db =  new taskMangerDb()



/* New task divBtn variable */
let addTaskDiv = document.createElement("div");
addTaskDiv.classList.add("task-card");
addTaskDiv.classList.add("add-new-task");
addTaskDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
    <h3 class="task-headiing">Add new task</h3>
`;
addTaskDiv.addEventListener("click", () => window.location.href=`create-new-task.html`)




/* searchBtn toogle */
searchButton.addEventListener("click", () => {
    searchButton.classList.toggle("search-open")
    header.classList.toggle("show-search")
    search.classList.toggle("show")
})

/* categories tab button event listener */
statusTabs.forEach((button) => button.addEventListener("click", (event) => {
    statusTabs.forEach(tab => tab.classList.remove("active"));
    let tab = event.target
    tab.classList.add("active")
    let sortby = document.querySelector("#sort-category").value

    searchByStatus(tab.dataset.statustype,sortby)
}));

/* sort by button event listener */
document.querySelector("#sort-category").addEventListener("change", (event) => {
    let sort = event.target.value;
    let status;

    statusTabs.forEach( tab => {
        if(tab.classList.contains("active")) {
            status = tab.dataset.statustype
        }
    }) 
    searchByStatus(status,sort)

})


/* getting all task and rendering function */
function getAllTasks() {
    let sortby = document.querySelector("#sort-category").value

    db.getAllTasks(sortby).then(tasks => {
        if(tasks.length > 0) {
            renderTasks(tasks);
        } else {
            taskGrid.style.display = "block";
            taskGrid.innerHTML = "<h2 class='no-task'>No tasks!</h2>";
        }
    });
}

/* render all task at load */
getAllTasks()


/* seach for tasks by status and sortby function*/
function searchByStatus(search,sort) {
    

    if (search === "all") {

        getAllTasks()

        return;
    }
    db.getByIndex("status",search,sort)
        .then((tasks) => {
            if(tasks.length > 0) {
                renderTasks(tasks);
            } else {
                taskGrid.style.display = "block";
                taskGrid.innerHTML = "<h2 class='no-task'>No tasks found for this " + search + " status.</h2>";
            }
        })
}


/* rendering function */ 
function renderTasks(tasks) {
    taskGrid.innerHTML = "";
    taskGrid.style.display = "grid";

    tasks.forEach(task => {
        let newTask = document.createElement("div")
        newTask.classList.add("task-card")
        newTask.innerHTML = `
        
            <h3 class="task-headiing">${task.title}</h3>
            <div class="middle">
                <div class="divider"></div>

                <p class="task-description">${task.description}</p>
            </div>

            <div class="bottom">
                <span class="task-due">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>
                    <span class="task-due-date">${changeDateFormat(`${task.dueDate}`)}</span>
                </span>

                <div class="categories-label">
                    <a href="" class="piyority" data-type="${task.priority}">${task.priority}</a>
                    <a href="" class="category" data-type="${task.category}">${task.category}</a>
                    <a href="" class="status" data-type="${task.status}">${task.status}</a>
                </div>
            </div>

        `
        newTask.addEventListener('click', () => window.location.href="task.html")

        taskGrid.appendChild(newTask)

    })
    taskGrid.appendChild(addTaskDiv)
}


// setTimeout(() => db.updateTaskEntry("category","fitness",3),200);


