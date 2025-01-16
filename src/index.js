/* Dashboard scrpt */
const { Calendar } = window.VanillaCalendarPro;
const taskChart = document.getElementById('task-chart');
const canvas = document.querySelector('canvas'); 
let aspectRatio;
let dataset = [12, 19, 5, 15]
let datasetPercents = ['12%', '19%', '5%', '15%'];



// https://vanilla-calendar.pro/docs/learn/handle-get-and-change-every-day


const inprogressBar = document.querySelector(".inprogress-bar")
inprogressBar.style.strokeDashoffset = "210";



/* Initialting calander */

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
    selectedDates: ['2025-01-04', '2025-01-20'],
    onClickDate(self) {
        console.log(self.context.selectedDates);
        window.location.href = `${self.context.selectedDates}`
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



/* Initiaciating TaskChart */
let chart;

window.addEventListener("resize", () => {
  if(window.matchMedia("(max-width: 576px)").matches) {
    aspectRatio = 2/1.5;
  } else {
    aspectRatio = 2/1
  }


  chart.destroy();
  createChart()
})



function createChart () {
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


createChart ()





  