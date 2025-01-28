import { taskMangerDb } from "../db/data-module.js";
import {changeDateFormat} from "../src/utils/functions.js";
import {checkForDued} from "./utils/functions.js";
let search = document.querySelector(".search");
let searchItem = document.querySelector(".search-item");
const searchBox = document.querySelector(".search-box");
const taskGrid = document.querySelector(".tab-grid");
const searchButtonSearch = document.querySelector(".search-button-search")
const searchButtonBancel = document.querySelector(".search-button-cancel");
const searchButton = document.querySelector(".search-button");
const header = document.querySelector("header");
const statusTabs = document.querySelectorAll(".category-tab")
const db =  new taskMangerDb()


/* if tasks are to be render buy there duedate */
let dateId = sessionStorage.getItem("dateId");


/* If user click on detail page */
let searchStatus = sessionStorage.getItem("status");
if(searchStatus) {

    db.getByIndex("status",searchStatus,"all")
        .then((tasks) => {
            if(tasks.length > 0) {
                renderTasks(tasks);
                
            } else {
                taskGrid.style.display = "block";
                taskGrid.innerHTML = "<h2 class='no-task'>No tasks found for this " + searchStatus + " status.</h2>";
            }
        })

    statusTabs.forEach(tab => {
        tab.classList.remove("active");
        if(tab.dataset.statustype === searchStatus) {
            
            tab.classList.add("active");
        }
    })
    sessionStorage.removeItem("status");
    
} else if (dateId) {

    db.getAllTasks("all").then(tasks => {
        if(tasks.length > 0) {
            let selectedTasks = tasks.filter(task => task.dueDate === dateId);
            renderTasks(selectedTasks);

        } else {
            taskGrid.style.display = "block";
            taskGrid.innerHTML = "<h2 class='no-task'>You have no task available please create new one!</h2>";
        }
    });

    sessionStorage.removeItem("dateId");

} else {
    /* render all task at load */
    getAllTasks()
}


/* Searching function */
function searchTask() {
    let searchFilter = document.querySelector("#search-filter").value;
    if (!searchFilter) {
        searchFilter = "title";
    }

    db.searchTask(searchBox.value,searchFilter).then((results) => {
        if(results.length > 0) {
            renderTasks(results)
        } else {
            taskGrid.style.display = "block";
            taskGrid.innerHTML = "<h2 class='no-task'>No tasks found for this " + searchBox.value + ".</h2>";
        }
    });

}



/* searchBtn toogle */
searchButton.addEventListener("click", () => {
    searchButton.classList.toggle("search-open")
    header.classList.toggle("show-search")
    search.classList.toggle("show")
})

/* Search button and searchbox event listener */
searchItem.addEventListener("click", searchTask)

searchBox.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        searchTask();
    }
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
            taskGrid.innerHTML = "<h2 class='no-task'>You have no task available please create new one!</h2>";
        }
    });
}



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
                    <a href="#" class="piyority" data-type="${task.priority}">${task.priority}</a>
                    <a href="#" class="category" data-type="${task.category}">${task.category}</a>
                    <a href="#" class="status" data-type="${task.status}">${checkForDued(task.dueDate)? "⏰ Over due": task.status}</a>
                </div>
            </div>

        `
        newTask.addEventListener('click', () => window.location.href=`task.html?taskid=${task.id}`)

        taskGrid.appendChild(newTask)

    })
}




