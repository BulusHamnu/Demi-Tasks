/* Dashboard scrpt */
const { Calendar } = window.VanillaCalendarPro;
let cat = 1;
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





  