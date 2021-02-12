// {
//     "date": "22.02.2021",
//     "courses": [
//         {
//             "startTime": "08:30:00",
//             "endTime": "10:00:00",
//             "classes": [
//                 "604_F",
//                 "604_D"
//             ],
//             "teachers": [
//                 "Schumacher M"
//             ],
//             "location": "Bellevue 209",
//             "courseTitle": "644-1 Mobile Developement"
//         },
//         {
//             "startTime": "10:20:00",
//             "endTime": "11:05:00",
//             "classes": [
//                 "604_F",
//                 "604_D"
//             ],
//             "teachers": [
//                 "Schumacher M"
//             ],
//             "location": "Bellevue 209",
//             "courseTitle": "644-1 Cloud "
//         }
//     ]
// }

const { text } = require("express");

// {
//     "week": "8",
//     "days": [
//         {
//             "date": "22.02.2021",
//             "courses": [
//                 {
//                     "startTime": "08:30:00",
//                     "endTime": "10:00:00",
//                     "classes": [
//                         "604_F",
//                         "604_D"
//                     ],
//                     "teachers": [
//                         "Schumacher M"
//                     ],
//                     "location": "Bellevue 209",
//                     "courseTitle": "644-1 Mobile Developement"
//                 },
//                 {
//                     "startTime": "10:20:00",
//                     "endTime": "11:05:00",
//                     "classes": [
//                         "604_F",
//                         "604_D"
//                     ],
//                     "teachers": [
//                         "Schumacher M"
//                     ],
//                     "location": "Bellevue 209",
//                     "courseTitle": "644-1 Cloud "
//                 }
//             ]
//         }
//     ]
// }

const addCoursesToDaySchedule = (courseElement, schedule) => {
    if (courseElement.className !== 'Ligne0' && courseElement.className !== 'Ligne1') {
        return;
    }

    if (courseElement.children.length === 5) {
        const [startTime, endTime] = courseElement.children[0].textContent.split('·').map(value => value.trim());
        const classes = courseElement.children[1].textContent.split('•').map(value => value.trim());
        const teachers = courseElement.children[2].textContent.split('•').map(value => value.trim());
        const location = courseElement.children[3].textContent.trim();
        const courseTitle = courseElement.children[4].textContent.trim();

        schedule.courses.push({
            startTime: startTime,
            endTime: endTime,
            classes: classes,
            teachers: teachers,
            location: location,
            courseTitle: courseTitle
        });

    } else {
        const courseElementLength = courseElement.children.length;

        let courseInformation = {};

        for (let i = 0; i < courseElementLength; i++) {
            courseInformation[i] = courseElement.children[i].textContent;
        }

        schedule.push(courseInformation);
    }

    addCoursesToDaySchedule(courseElement.nextElementSibling, schedule);
}

const addDaysToWeekSchedule = (tableRowElement, weekSchedule) => {
    if (tableRowElement.className === '') {
        return;
    }

    if (tableRowElement.className === 'HeaderDay') {

        console.log('HeaderDay className found !');

        const textData = tableRowElement.firstElementChild.textContent;
        const dayDate = textData.substring(textData.length - 10, textData.length);

        console.log(`textData : ${textData}`);
        console.log(`dayDate : ${dayDate}`);

        const daySchedule = {
            date: dayDate,
            courses: []
        };

        console.log(`daySchedule before call : ${daySchedule}`);

        addCoursesToDaySchedule(tableRowElement.nextElementSibling, daySchedule);

        console.log(`daySchedule after call : ${daySchedule}`);

        weekSchedule.days.push(daySchedule);
    }

    addDaysToWeekSchedule(tableRowElement.nextElementSibling, weekSchedule);
}

const getScheduleForDay = (htmlDocument, date) => {
    const daySchedule = {
        date: date,
        courses: []
    };

    const dateElements = htmlDocument.querySelectorAll(".HeaderDay");

    let correspondingDateElement = null;

    for (const element of dateElements) {
        if (element.children[0].textContent.includes(date)) {
            correspondingDateElement = element;
            break;
        }
    }

    if (!correspondingDateElement) {
        // TODO: Log no corresponding date found
        return {};
    }

    // Add to daySchedule in a recursive manner the information from each course element found after the corresponding date element
    addCoursesToDaySchedule(correspondingDateElement.nextElementSibling, daySchedule);

    return daySchedule;
};

const getScheduleForWeek = (htmlDocument, weekNumber) => {
    // Use getScheduleForDay on each day of the week
    const weekSchedule = {
        week: weekNumber,
        days: []
    };

    const dateElements = htmlDocument.querySelectorAll(".HeaderWeek");

    console.log(`nb headerWeek : ${dateElements.length}`);

    let correspondingDateElement = null;

    for (const element of dateElements) {
        if (element.children[0].textContent.startsWith(`Semaine / Woche ${weekNumber}`)) {
            correspondingDateElement = element;
            break;
        }
    }

    if (!correspondingDateElement) {
        // TODO: Log no corresponding date found
        return {};
    }

    // Add each day and its courses to the week schedule
    addDaysToWeekSchedule(correspondingDateElement.nextElementSibling, weekSchedule);

    console.log(`weekSchedule : ${weekSchedule}`);

    return weekSchedule;
};


module.exports = { getScheduleForDay, getScheduleForWeek };
