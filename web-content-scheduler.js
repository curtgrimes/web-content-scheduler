function webContentScheduler() {
    'use strict';

    var scheduleElements = document.querySelectorAll('[data-schedule]');

    Array.prototype.forEach.call(scheduleElements, function (el) {
        var dateRangesMatchingCurrentDate = parseIntoDateRanges(el.dataset.schedule).filter(function (dateRange) {
            var now = new Date();
            
            // If the current date is within the start ([0]) and end ([1])
            return dateRange[0] <= now && dateRange[1] >= now;
        });
        
        var className = 'schedule-shown';
        if (dateRangesMatchingCurrentDate.length > 0) {
            // Show this element
            el.classList.add(className);
        }
        else {
            el.classList.remove(className);
        }
    });

    function parseIntoDateRanges(dateRangesAttribute) {
        // Split multiple ranges into pipes
        var ranges = dateRangesAttribute.split('|');

        // Parse each range into a start and end
        return ranges.map(function (range) {
            // A range looks like "04/24-04/28"
            var startAndEnd = range.split('-');

            // Remove empty values
            startAndEnd = startAndEnd.filter(function (value) { return value; });

            if (startAndEnd.length === 0) return;

            // Validate each date. If the year is missing, assume
            // the current year.

            var splitDateObjects = startAndEnd.map(function (dateString, index) {
                dateString = dateString.trim();
                var isStartRange = index === 0;
                var isEndRange = index === 1;

                var regex = /^(\d{4})?\/?(\d{2})\/(\d{2}) ?(\d\d)?:?(\d\d)?:?(\d\d)?$/gm;
                var match, year, month, day, hour, minute, second;

                while ((match = regex.exec(dateString)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    year = match[1];
                    month = match[2];
                    day = match[3];
                    hour = match[4];
                    minute = match[5];
                    second = match[6];
                }

                // End here if invalid date
                if (!month || !day) return;

                // A year wasn't provided, so assume the current year
                if (!year) year = (new Date()).getFullYear();

                if (hour) {
                    // A time was provided.
                    return {
                        y: year,
                        m: month,
                        d: day,
                        h: hour,
                        min: (minute || '00'),
                        s: (second || '00'),
                    };
                }
                else if (isStartRange) {
                    // A time wasn't provided, so assume 00:00:00 (start of the day)
                    return {
                        y: year,
                        m: month,
                        d: day,
                        h: '00',
                        min: '00',
                        s: '00',
                    };
                }
                else if (isEndRange) {
                    // A time wasn't provided, so assume 23:59:59 (end of the day)
                    return {
                        y: year,
                        m: month,
                        d: day,
                        h: '23',
                        min: '59',
                        s: '59',
                    };
                }
            });

            if (splitDateObjects.length === 1) {
                // There is a start but no end. Set the end to the 
                // same day as start but with an ending time at the 
                // end of the day.

                splitDateObjects.push({
                    y: splitDateObjects[0].year,
                    m: splitDateObjects[0].month,
                    d: splitDateObjects[0].day,
                    h: '23',
                    min: '59',
                    s: '59',
                });
            }

            return splitDateObjects.map(function (d) {
                // yyyy-mm-dd hh:mm:ss
                return new Date(d.y + '-' + d.m + '-' + d.d + ' ' + d.h + ':' + d.min + ':' + d.s);
            });
        });
    }

}

function initWebContentSchedulerTimer() {
    // run every 60 seconds
    setInterval(webContentScheduler, 1000 * 60);

    // Run on load
    webContentScheduler();
}

if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
    // Document is ready to go
    initWebContentSchedulerTimer();
}
else {
    document.addEventListener("DOMContentLoaded", initWebContentSchedulerTimer);
}
