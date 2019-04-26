# Web Content Scheduler

A small script for showing or hiding HTML content client-side based on the current date when you can't do it server-side. Zero dependencies.

## Usage
1. Include this JavaScript on the page:
    ```html
    <script src="https://cdn.jsdelivr.net/gh/curtgrimes/web-content-scheduler@1.0.0/web-content-scheduler.min.js"></script>
    ```

1. Add this CSS to the page:
    ```css
    [data-schedule]:not(.schedule-shown) { display:none; }
    ```

1. Add a `data-schedule` attribute to any elements that you want to show or hide on a specific date or date range.

    When specifying dates, use the format `YYYY/MM/DD`. Add a dash between dates to indicate a date range. Add a pipe (`|`) between ranges to separate multiple ranges.

    ### Examples:

    **Date and time ranges**

    1. Show an element from 2019/04/26 through 2019/04/30. Hide it at any time outside this range.
        ````html
        <div data-schedule="2019/04/26 - 2019/04/30">Hello world</div>
        ````

    1. Show an element from 2019/04/26 10:00:00 local time through 2019/04/26 16:00:00 local time. Hide it at any time outside this range.
        ````html
        <div data-schedule="2019/04/26 10:00:00 - 2019/04/30 16:00:00">Hello world</div>
        ````

    **Without year**

    1. Show an element every year from February 15 through February 20. Hide it at any time outside this range.
        ````html
        <div data-schedule="02/15 - 02/20">Hello world</div>
        ````

    1. Show an element every April 10. Hide it on any other day of the year.
        ````html
        <div data-schedule="04/10">Hello world</div>
        ````

    **Multiple ranges**

    1. Show an element every year from January 1 through January 25 and July 1 through July 15. Hide it at any time outside this range.
        ````html
        <div data-schedule="01/01 - 01/25 | 07/01 - 07/15">Hello world</div>
        ````

## It's just client-side
This is for environments where it makes the most sense to do this client-side in JavaScript. If you have important content that you don't want to be sent to the user at all during certain time ranges, look at ways to do this server-side.

## Debugging
To show all the scheduled content on the page that may be hidden, run this in the console. Any elements that were hidden will become hidden again when the script runs in the background (by default, once every minute);
```js
document.querySelectorAll('[data-schedule]').forEach((e) => { e.classList.add('schedule-shown') });
```