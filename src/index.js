/* Dashboard scrpt */
const { Calendar } = window.VanillaCalendarPro;
import { getISOWeek } from "https://cdn.jsdelivr.net/npm/date-fns/getISOWeek.mjs";
import { getWeek } from "https://cdn.jsdelivr.net/npm/date-fns/getWeek.mjs";
import  {taskMangerDb} from "../db/data-module.js"
import {setFillPercent, getCurrentTime} from "./utils/functions.js"
import {getPercentage,sendNofitication} from "./utils/functions.js"
const taskChart = document.getElementById('task-chart');
const canvas = document.querySelector('canvas'); 
let aspectRatio;
let dataset; 
let datasetPercents;
const db = new taskMangerDb()
let allTasks;
const periodSelector = document.querySelector("#period-selector");
let NotificationBtn = document.querySelector(".notification");





const detailCard = document.querySelectorAll(".detail-card").forEach( card => {
  card.addEventListener("click", () => {
    sessionStorage.setItem("status", card.dataset.status);
    window.location.href = `alltasks.html`;
  })
})


// https://vanilla-calendar.pro/docs/learn/handle-get-and-change-every-day

/* getting all tasks */


/* stray haha functions */
function getThisWeekTasks (tasks) {
  let g = tasks.filter( task => {
    console.log(task.dueDate);
    let week = getWeek(new Date(task.dueDate),{ weekStartsOn: 0 });
    let thisWeek = getWeek(new Date(),{ weekStartsOn: 0 });

    if (week === thisWeek) {
      return task
    } 

  })
  chart.destroy();
  runApp(g)

}
function getThisMonthTasks (tasks) {
  let g = tasks.filter( task => {
    let month = new Date(task.dueDate).getMonth();
    let thisMonth = new Date().getMonth();

    if (month === thisMonth) {
      return task
    } 

  })
  chart.destroy();
  runApp(g)

}

function getThisYearTasks (tasks) {
  let g = tasks.filter( task => {
    let year = new Date(task.dueDate).getFullYear();
    let thisYear = new Date().getFullYear();

    if (year === thisYear) {
      return task
    } 
    
  })
  
  chart.destroy();
  runApp(tasks)
}

/* Check amount of tasks in a particular date */
function setAmountOfTasks(tasksDate,dates) {
  let f = document.querySelectorAll(`[aria-selected="true"]`).forEach( btn => {

    tasksDate.forEach(date => {

      if(btn.parentElement.dataset.vcDate === date) {
        let p = new Date(date).getDate();

        let d;
        d = dates.filter(date => {return p === date})
    
        let h = `"${d.length}"`;

        if(h) {
          btn.style.setProperty('--tasks-num',h)
        }

      }

    })

  })

}

/* end of stray function */




db.getAllTasks("all").then((tasks) => {
  allTasks = tasks;
  runApp(tasks);
  checkForNotifications()

  
  periodSelector.addEventListener("change", () => {

    switch (periodSelector.value) {
      case "all":
        chart.destroy();
        runApp(allTasks)
        break;
      case "this week":
        getThisWeekTasks(allTasks)
        break;
      case "this month":
        getThisMonthTasks(allTasks);
        break;
      case "this year":
        getThisYearTasks(allTasks)
        break;
      default:
        alert("Invalid period selected")
        break;
    }
  
  })
  
});



/* Initialting calander */

function initCalander(tasksDate) {
  const options = {
    locale: {
      months: {
        short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
      },
      weekdays: {
        short: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
    },

    /* My logic */
    // selectionDatesMode: 'multiple',
    selectedDates: tasksDate.map(d => {return d}),
    onClickDate(self,event) {
        let btnDate = event.target.parentElement.dataset.vcDate;

        if(tasksDate.includes(btnDate) ) {
          sessionStorage.setItem("dateId",btnDate);
          window.location.href = "alltasks.html";

        }

        setAmountOfTasks(tasksDate,dates)

    },
    onClickArrow(self) {
      setAmountOfTasks(tasksDate,dates)
    },


    layouts: {
        default: `
        <div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation" style="color:var(--text-color)">
            <div class="vc-header__content" data-vc-header="content">
               <#Month /><#Year />
            </div>
          </div>

          <div class="vc-wrapper" data-vc="wrapper">
            <#WeekNumbers />
            <div class="vc-content" data-vc="content">
              <#Week />
              <#Dates />
              <#DateRangeTooltip />
            </div>
          </div>
          <#ControlTime />
          
          <div style="display:flex; justify-content:space-between; margin-top:2rem;">
            <div class="arrows-control"><#ArrowPrev /></div>
            <div class="arrows-control"><#ArrowNext /></div>
            
          </div>
          
        `,
      },

      selectedTheme: 'none',
  };
  

  const calendar = new Calendar('#calendar', options);
  calendar.init();

  let dates = tasksDate.map(date => { let day = new Date(date).getDate(); return day; });
  // console.log(dates);
  
  setAmountOfTasks(tasksDate,dates)


}


/* Initiaciating TaskChart */
let chart;

function createChart () {
  window.addEventListener("resize", () => {
  if(window.matchMedia("(max-width: 576px)").matches) {
    aspectRatio = 2/1.5;
  } else {
    aspectRatio = 2/1
  }


  chart.destroy();
  createChart()
  })

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientWidth/aspectRatio;
  

  chart = new Chart(taskChart, {
    type: 'bar',
    data: {
      labels: datasetPercents.map(d => {return d}),
      datasets: [{
        label: 'Rate of tasks',
        data: dataset.map((d) => { return d}),
        backgroundColor: [
          'rgba(255, 204, 0, 1)',
          'rgba(34, 255, 0, 1)',
          'rgba(255, 0, 0, 1)',
          'rgba(197, 163, 163, 1)'
        ],
        borderWidth: 1,
        responsive : true,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


/* intit page */
function runApp(tasks) {
  let inCompleted = tasks.filter( task => task.status === "🔲 in-completed");
  let inProgress = tasks.filter( task => task.status === "🔄 in-progress");
  let completed = tasks.filter( task => task.status === "✅ completed");
  let overDue = tasks.filter( task => task.status === "⏰ over-due");

  let a = getPercentage(inCompleted.length,tasks.length);
  let b = getPercentage(inProgress.length,tasks.length)
  let c = getPercentage(completed.length,tasks.length)
  let d = getPercentage(overDue.length,tasks.length) 

  const inprogressBar = document.querySelector(".inprogress-bar").style.strokeDashoffset = setFillPercent(b);
  const completedProgressBar = document.querySelector(".completed-progressbar").style.strokeDashoffset = setFillPercent(c);
  const overDueProgressbar = document.querySelector(".over-due-progressbar").style.strokeDashoffset = setFillPercent(d);
  const inCompletedProgressbar = document.querySelector(".in-completed-progressbar").style.strokeDashoffset = setFillPercent(a);

  const inprogressBarNumber = document.querySelector('#inprogress-bar-number').innerHTML = `${b}%`;
  const completedBarNumber = document.querySelector('#completed-number').innerHTML = `${c}%`;
  const overDueNumber = document.querySelector('#over-due-number').innerHTML = `${d}%`;
  const inCompletedNumber = document.querySelector("#in-completed-number").innerHTML = `${a}%`;


  dataset = [b,c,d,a];
  datasetPercents = [b + "%",c + '%',d + '%',a + '%'];

  let tasksDate = tasks.map(task => task.dueDate);
  initCalander(tasksDate)


  createChart()


}



/* notification functions */
NotificationBtn.addEventListener("click", () => { document.querySelector(".notifications-display").classList.add("show-reminders"); });
document.querySelector(".close-notifications-display").addEventListener("click", () => document.querySelector(".notifications-display").classList.remove("show-reminders"));


let reminders = [];
let remindersPro;

/* check for reminder */
let checkForNotifications = () => {
  if(allTasks.length > 0) {
    allTasks.forEach(task => {

      if(task.reminderDetails.type.trim() === "daily") {
        let newReminder = {
          title : task.title,
          time : task.reminderDetails.time,
        };
        reminders.push(newReminder);

      } else if(task.reminderDetails.type.trim() === "weekly") {
        let week = getWeek(new Date(task.reminderDetails.date), { weekStartsOn: 0 });
        let thisWeek = getWeek(new Date(), { weekStartsOn: 0 });
        
        let now = new Date().toISOString().split("T")[0];

          if(week === thisWeek && task.reminderDetails.date === now ) {
            let newReminder = {
              title : task.title,
              time : task.reminderDetails.time,
            };
            reminders.push(newReminder);

          }
      } else if(task.reminderDetails.type.trim() === "monthly" && new Date(task.reminderDetails.date).getMonth() === new Date().getMonth()) {
        if(new Date(task.reminderDetails.date).getDate() === new Date().getDate()) {
          let newReminder = {
            title : task.title,
            time : task.reminderDetails.time,
          };
          reminders.push(newReminder);
        }
        
      } else if(task.reminderDetails.type === "yearly" && new Date(task.reminderDetails.date).getFullYear() === new Date().getFullYear()) {
        if(task.reminderDetails.date === new Date().toISOString().split("T")[0]) {
          let newReminder = {
            title : task.title,
            time : task.reminderDetails.time,
          };
          reminders.push(newReminder);

        }
      }

    });


    /* check for reminder when page load */
    let currentTime = getCurrentTime();
    let removeIndexes = [];

    reminders.forEach((reminder,index) => {
      if(reminder.time === currentTime) {

       setTimeout(() => {
        sendNofitication("Reminder",`${reminder.title} is now`);
       }, 1500);
       removeIndexes.push(index);

      } else if (reminder.time  < currentTime){

        let today = new Date().toISOString().split("T")[0];

        /* geting this formulass from stack overflow */
        let date1 = new Date(`${today}T${reminder.time}`);
        let date2 = new Date(`${today}T${currentTime}`);
        let diff = date2 - date1;

        if(parseInt(backToTime(diff)) < 1) {
          sendNofitication("Reminder",`You missed ${reminder.title} :(`);
        }

        removeIndexes.push(index);
      }
    
    });

    /* filter task that that are already due */
    remindersPro = reminders.filter((reminder,index) => {return !removeIndexes.includes(index);});

    if(remindersPro.length > 0) {
      NotificationBtn.classList.add("new-message");
    }

    renderReminder(remindersPro);
    setRemnderForLater(reminders);

  }
  
}

/* shedule reminders for later */
function setRemnderForLater() {
  
  setInterval(() => {
    let currentTime = getCurrentTime();

    remindersPro.forEach((reminder,index) => {
      if(reminder.time === currentTime) { 

       setTimeout(() => {
        sendNofitication("Reminder",`${reminder.title} is now`);
        remindersPro.splice(index, 1);

        if(remindersPro.length <= 0 ) {NotificationBtn.classList.remove("new-message");}
        
        renderReminder(remindersPro);
       }, 1500);

      } 
    
    });

  },60000);

  
}


/* Function for changing time back to default time value */
function backToTime(diff) {

  let ms = diff % 1000;
  let ss = Math.floor(diff / 1000) % 60;
  let mm = Math.floor(diff / 1000 / 60) % 60;
  let hh = Math.floor(diff / 1000 / 60 / 60);

  // console.log(`${diff}ms = ${hh}hr, ${mm}min, ${ss}sec, ${ms}ms`);

  return mm;
}


/* redering reminders */
function renderReminder (a) {
  
  document.querySelector(".reminders").innerHTML = '';
  if(a.length > 0) {
    a.forEach( reminder => {
      
      let list = document.createElement("li");
      list.classList.add("task-reminders");
      list.innerHTML = `
        <p class="task-title">${reminder.title}</p>
        <p class="task-time">Time: ${changeFormat(reminder.time)} ${reminder.time >= "12:00"? "PM" : "AM"}</p>
      `;
  
      document.querySelector(".reminders").appendChild(list);
    })

  } else {
    document.querySelector(".reminders").innerHTML = "<p>No Reminder Available.</p>";
  }
}

/* change time format to 12 hour */
function changeFormat(time){
  let today = new Date().toISOString().split("T")[0];

  let timeFormat = new Date(`${today}T${time}`).toLocaleString([], { hour12: true}).split(",")[1];

  return timeFormat.slice(0,6)
}


  