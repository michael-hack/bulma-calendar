# bulma-calendar
Bulma's extension to display a calendar. It can be used on page as large calendar with apointments or in modal/popup for datepicker.
(find all my bulma's extensions [here](https://github.com/Wikiki/bulma-extensions))

<img src="https://img4.hostingpics.net/pics/812322ScreenShot20170810at125834.png" width="50%">

Usage
---
```html
<div class="calendar">
  <div class="calendar-nav">
    <div class="calendar-nav-left">
      <button class="button is-link">
        <i class="fa fa-chevron-left"></i>
      </button>
    </div>
    <div>March 2017</div>
    <div class="calendar-nav-right">
      <button class="button is-link">
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>
  </div>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="calendar-date">Sun</div>
      <div class="calendar-date">Mon</div>
      <div class="calendar-date">Tue</div>
      <div class="calendar-date">Wed</div>
      <div class="calendar-date">Thu</div>
      <div class="calendar-date">Fri</div>
      <div class="calendar-date">Sat</div>
    </div>
    <div class="calendar-body">
      <div class="calendar-date is-disabled"><button class="date-item">26</button></div>
      <div class="calendar-date is-disabled"><button class="date-item">27</button></div>
      <div class="calendar-date is-disabled"><button class="date-item">28</button></div>
      <div class="calendar-date"><button class="date-item">1</button></div>
      <div class="calendar-date"><button class="date-item">2</button></div>
      <div class="calendar-date"><button class="date-item">3</button></div>
      <div class="calendar-date tooltip" data-tooltip="Today"><button class="date-item date-today">4</button></div>
      <div class="calendar-date tooltip" data-tooltip="Not available"><button class="date-item" disabled="">5</button></div>
      <div class="calendar-date"><button class="date-item">6</button></div>
      <div class="calendar-date"><button class="date-item">7</button></div>
      <div class="calendar-date tooltip" data-tooltip="You have appointments"><button class="date-item badge">8</button></div>
      <div class="calendar-date"><button class="date-item">9</button></div>
      <div class="calendar-date"><button class="date-item">10</button></div>
      <div class="calendar-date"><button class="date-item">11</button></div>
      <div class="calendar-date"><button class="date-item">12</button></div>
      <div class="calendar-date"><button class="date-item">13</button></div>
      <div class="calendar-date"><button class="date-item">14</button></div>
      <div class="calendar-date"><button class="date-item">15</button></div>
      <div class="calendar-date calendar-range range-start"><button class="date-item active">16</button></div>
      <div class="calendar-date calendar-range"><button class="date-item">17</button></div>
      <div class="calendar-date calendar-range"><button class="date-item">18</button></div>
      <div class="calendar-date calendar-range"><button class="date-item">19</button></div>
      <div class="calendar-date calendar-range range-end"><button class="date-item active">20</button></div>
      <div class="calendar-date"><button class="date-item">21</button></div>
      <div class="calendar-date"><button class="date-item">22</button></div>
      <div class="calendar-date"><button class="date-item">23</button></div>
      <div class="calendar-date"><button class="date-item">24</button></div>
      <div class="calendar-date"><button class="date-item">25</button></div>
      <div class="calendar-date"><button class="date-item">26</button></div>
      <div class="calendar-date"><button class="date-item">27</button></div>
      <div class="calendar-date"><button class="date-item">28</button></div>
      <div class="calendar-date"><button class="date-item">29</button></div>
      <div class="calendar-date"><button class="date-item">30</button></div>
      <div class="calendar-date"><button class="date-item">31</button></div>
      <div class="calendar-date is-disabled"><button class="date-item">1</button></div>
    </div>
  </div>
</div>
```

Modifiers
---
You can use standards color modifiers and you can change the calendar's size using the following modifiers:
- is-calendar-large

Variables
---
This extension uses the following variables

Name | Description | Default value    
-----|-------------|---------------
$calendar-border | Default border color | .1rem solid $grey-lighter
$calendar-border-radius | Calendar border radius | $radius-small

Demo
---
You can find a demo [here](https://codepen.io/wikiki/pen/KvqKzK)

Integration
---
- Clone the [bulma repo](https://github.com/jgthms/bulma)
- Under the `sass` folder, create a new folder called `extensions`
- In this new folder, create a new file `calendar.sass`
- Copy the code form the `bulma-calendar repo`'s [ribbon.sass](https://github.com/Wikiki/bulma-calendar/blob/master/calendar.sass) file into your new file
- In the same folder create a new file `_all.sass` (this is not required, but will help when you add more extensions)
- In this file add this code:
```
@charset "utf-8"

@import "calendar.sass"
```
At the end of the `bulma.sass` file, add this line: `@import "sass/extensions/_all"`

Now, you can just build the bulma project with `npm run build`, and the output will be available in the `css folder`.
