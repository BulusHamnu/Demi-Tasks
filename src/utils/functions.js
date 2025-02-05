import { getWeek } from "https://cdn.jsdelivr.net/npm/date-fns/getWeek.mjs";
let NotificationBtn = document.querySelector(".notification");

export function getFileCoverType(fileType) {
    let coverLink;

    if(fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/.gif" || fileType === "image/.svg" || fileType === "image/.jpeg") {
        return coverLink = `assert/file-covers/image.png`

    } else if (fileType === "application/pdf") {
        return coverLink = `assert/file-covers/pdf.png`
    } else if (fileType === "text/plain") {
       return coverLink = `assert/file-covers/text-file.jpg`
    } else if (fileType === "application/zip" || fileType === "application/application/gzip" || fileType === "application/application/x-tar") {
      return coverLink = `assert/file-covers/zip-file.jpg`
    } else {
       return coverLink = `assert/file-covers/document.jpg`
    }

}


export function changeDateFormat(dateData) {
    let dateFormat = new Date(dateData);
    let date = dateFormat.getDate();
    let month = dateFormat.getMonth();
    let year = dateFormat.getFullYear();
    if(month === 0) {
        month = "Jan"
    } else if(month === 1) {
        month = "Feb"
    } else if(month === 2) {
        month = "Mar"
    } else if(month === 3) {
        month = "April"
    } else if(month === 4) {
        month = "May"
    } else if(month === 5) {
        month = "Jun"
    } else if(month === 6) {
        month = "jul"
    } else if(month === 7) {
        month = "Aug"
    } else if(month === 8) {
        month = "Sep"
    } else if(month === 9) {
        month = "Oct"
    } else if(month === 10) {
        month = "Nov"
    } else if(month === 11) {
        month = "Dec"
    }

    return `${date} ${month} ${year}`
}
export function changeDateFormatNumber(dateData) {
    let dateFormat = new Date(dateData);
    let date = dateFormat.getDate();
    let month = dateFormat.getMonth();
    let year = dateFormat.getFullYear();
    
    return `${year}-${month}-${date}`
}



/* function for calucating circle fill percentage */
export function setFillPercent(percent) {
    const circumference = 219.91;
    const offset = circumference * ( 1 - percent/100 );

    return offset;
}

/* get percentage */
export function getPercentage(value,total) {
    if(value === 0 ) {
        return 0;
    }

    let percentage = value / total * 100;
    return Math.floor(percentage);
}


export function checkForDued(taskDueDate) {
    let now = new Date().toISOString().split("T")[0];
    
    if(taskDueDate < now ) {
        return true;
    }
}

 
/* send nofitication function */
export function sendNofitication(title,message) {

    const options = {
        body: message,
        icon: "../assert/file-covers/image.png",
      };
    
    if (!("Notification" in window)) {
        alert("This browser does not support notifications.");
      } else if(Notification.permission === "granted") {
        const notification = new Notification(title,options);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then( permission => {
          if (permission === "granted") {
            const notification = new Notification(title,options);
          }
        });
  
      }
}


/* getting current time for notiufication */
export function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();   // 0-23 (24-hour format)
    const minutes = now.getMinutes();
    return hours + ':' + minutes;
  
}

/* change time format to 12 hour */
export function changeFormat(time){
    let today = new Date().toISOString().split("T")[0];
  
    let timeFormat = new Date(`${today}T${time}`).toLocaleString([], { hour12: true}).split(",")[1];
  
    return timeFormat.slice(0,6)
}


/* class for checking notification sheduling notification */
export class Notifiyer {
    constructor() {
        this.reminders = [];
        this.remindersPro = [];
    }

    checkForNotifications (tasks) {

      if(tasks.length > 0) {
        tasks.forEach(task => {
          if(task.reminderDetails.type.trim() === "daily") {
            let newReminder = {
              title : task.title,
              time : task.reminderDetails.time,
            };
            this.reminders.push(newReminder);
    
          } else if(task.reminderDetails.type.trim() === "weekly") {
            let week = getWeek(new Date(task.reminderDetails.date), { weekStartsOn: 0 });
            let thisWeek = getWeek(new Date(), { weekStartsOn: 0 });
            
            let now = new Date().toISOString().split("T")[0];
    
              if(week === thisWeek && task.reminderDetails.date === now ) {
                let newReminder = {
                  title : task.title,
                  time : task.reminderDetails.time,
                };
                this.reminders.push(newReminder);
    
              }
          } else if(task.reminderDetails.type.trim() === "monthly" && new Date(task.reminderDetails.date).getMonth() === new Date().getMonth()) {
            if(new Date(task.reminderDetails.date).getDate() === new Date().getDate()) {
              let newReminder = {
                title : task.title,
                time : task.reminderDetails.time,
              };
              this.reminders.push(newReminder);
            }
            
          } else if(task.reminderDetails.type === "yearly" && new Date(task.reminderDetails.date).getFullYear() === new Date().getFullYear()) {
            if(task.reminderDetails.date === new Date().toISOString().split("T")[0]) {
              let newReminder = {
                title : task.title,
                time : task.reminderDetails.time,
              };
              this.reminders.push(newReminder);
    
            }
          }
    
        });
    
    
        /* check for reminder when page load */
        let currentTime = getCurrentTime();
        let removeIndexes = [];
        this.reminders.forEach((reminder,index) => {
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
    
            if(parseInt(this.backToTime(diff)) < 1) {
              sendNofitication("Reminder",`You missed ${reminder.title} :(`);
            }
    
            removeIndexes.push(index);
          }
        
        });
    
        /* filter task that that are already due */
        this.remindersPro = this.reminders.filter((reminder,index) => {return !removeIndexes.includes(index);});
    
        if(this.remindersPro.length > 0) {
          NotificationBtn.classList.add("new-message");
        }
    
        this.renderReminder(this.remindersPro);
        this.setRemnderForLater(this.reminders);
    
      }
      
    }

    setRemnderForLater() {
      
      setInterval(() => {
        let currentTime = getCurrentTime();
    
        this.remindersPro.forEach((reminder,index) => {
          if(reminder.time === currentTime) { 
    
           setTimeout(() => {
            sendNofitication("Reminder",`${reminder.title} is now`);
            this.remindersPro.splice(index, 1);
    
            if(this.remindersPro.length <= 0 ) {NotificationBtn.classList.remove("new-message");}
            
            this.renderReminder(this.remindersPro);
           }, 1500);
    
          } 
        
        });
    
      },60000);
    
      
    }

    backToTime(diff) {

        let ms = diff % 1000;
        let ss = Math.floor(diff / 1000) % 60;
        let mm = Math.floor(diff / 1000 / 60) % 60;
        let hh = Math.floor(diff / 1000 / 60 / 60);
      
        // console.log(`${diff}ms = ${hh}hr, ${mm}min, ${ss}sec, ${ms}ms`);
      
        return mm;
    }

    renderReminder (a) {
  
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

}
