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


