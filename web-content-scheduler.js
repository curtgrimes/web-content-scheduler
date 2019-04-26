function webContentScheduler() {
    'use strict';

    var scheduleElements = document.querySelectorAll('[data-schedule]');

    Array.prototype.forEach.call(scheduleElements, function (el) {
        var dateRangesMatchingCurrentDate = parseIntoDateRanges(el.dataset.schedule).filter(function (dateRange) {
            var now = new Date();
            if (dateRange[0] <= now && dateRange[1] >= now) {
                return true;
            }
        });

        if (dateRangesMatchingCurrentDate.length > 0) {
            // Show this element
            el.classList.add('schedule-shown');
        }
        else {
            el.classList.remove('schedule-shown');
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
                var m, year, month, day, hour, minute, second;

                while ((m = regex.exec(dateString)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    year = m[1];
                    month = m[2];
                    day = m[3];
                    hour = m[4];
                    minute = m[5];
                    second = m[6];
                }

                // End here if invalid date
                if (!month || !day) return;

                // A year wasn't provided, so assume the current year
                if (!year) year = (new Date()).getFullYear();

                if (hour) {
                    // A time was provided.
                    return {
                        year: year,
                        month: month,
                        day: day,
                        hour: hour,
                        minute: (minute || '00'),
                        second: (second || '00'),
                    };
                }
                else if (isStartRange) {
                    // A time wasn't provided, so assume 00:00:00 (start of the day)
                    return {
                        year: year,
                        month: month,
                        day: day,
                        hour: '00',
                        minute: '00',
                        second: '00',
                    };
                }
                else if (isEndRange) {
                    // A time wasn't provided, so assume 23:59:59 (end of the day)
                    return {
                        year: year,
                        month: month,
                        day: day,
                        hour: '23',
                        minute: '59',
                        second: '59',
                    };
                }
            });

            if (splitDateObjects.length === 1) {
                // There is a start but no end. Set the end to the 
                // same day as start but with an ending time at the 
                // end of the day.

                splitDateObjects.push({
                    year: splitDateObjects[0].year,
                    month: splitDateObjects[0].month,
                    day: splitDateObjects[0].day,
                    hour: '23',
                    minute: '59',
                    second: '59',
                });
            }

            return splitDateObjects.map(function (d) {
                return new Date(d.year + '-' + d.month + '-' + d.day + ' ' + d.hour + ':' + d.minute + ':' + d.second);
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