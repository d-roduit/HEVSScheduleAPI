const FormData = require('form-data');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const dateUtility = require('../utility/dateUtility');
const scheduleUtility = require('../utility/scheduleUtility');

const get = async (req, res) => {
    const indexPageDocument = res.locals.indexPageDocument;

    // Check class parameter

    let isClassValid = false;
    let classValue = null;

    if (req.params.class.trim() != '' && req.params.class.length < 100) {
        const classesSelectElement = indexPageDocument.getElementById('DropDownListClasse');

        for (const option of classesSelectElement.children) {
            if (req.params.class === option.text) {
                isClassValid = true;
                classValue = option.value;
                break;
            }
        }
    }

    if (!isClassValid) {
        return res.status(404).json({ message: `No schedule found for the given class parameter '${req.params.class}'`});
    }

    // Class is valid, we check if a date has been given

    let hasDate = false;
    let isDateValid = false;
    let isWeekDate = false;
    let isDayDate = false;

    const dateParam = req.params.date;

    if (dateParam) {
        hasDate = true;

        const weekRegex = new RegExp('^[1-5]?[0-9]$');
        const dayRegex = new RegExp('^[0-3][0-9]-[0-1][0-9]-20[2-9][0-9]$');

        if (weekRegex.test(dateParam)) {
            const weekNumber = parseInt(dateParam);

            if (weekNumber >= 0 && weekNumber <= 52) {
                isDateValid = true;
                isWeekDate = true;
            }
        } else if (dayRegex.test(dateParam)) {
            const dateParamArray = dateParam.split('-');
            const day = parseInt(dateParamArray[0]);
            const month = parseInt(dateParamArray[1]);
            const year = parseInt(dateParamArray[2]);

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            if (day <= 31 && month >= currentMonth && month <= 12 && (year == currentYear || year == currentYear + 1)) {
                isDateValid = true;
                isDayDate = true;
            }
        }
    }

    if (hasDate && !isDateValid) {
        return res.status(404).json({ message: `No schedule found for the given date parameter '${dateParam}'`});
    }

    // Class is valid and Date is either valid or not given in parameter

    let scheduleDate;

    if (!hasDate) {
        scheduleDate = dateUtility.toSiteFormat(new Date());
        isDayDate = true;
    } else {
        if (isDayDate) {
            scheduleDate = dateParam.replace(/-/g, '.');
        } else if (isWeekDate) {
            scheduleDate = dateParam;
        }
    }

    const aspnetParameters = {
        viewState: indexPageDocument.getElementById('__VIEWSTATE').value,
        viewStateGenerator: indexPageDocument.getElementById('__VIEWSTATEGENERATOR').value,
        eventValidation: indexPageDocument.getElementById('__EVENTVALIDATION').value
    };

    const inputValues = {
        class: classValue,
        submitButton: indexPageDocument.getElementById('ButtonAfficheClass').value,
        teacher: indexPageDocument.getElementById('DropDownListProf').selectedOptions[0].value,
        course: indexPageDocument.getElementById('DropDownListBranches').selectedOptions[0].value,
        classroom: indexPageDocument.getElementById('DropDownListSalles').selectedOptions[0].value,
    };

    const requestData = {
        '__VIEWSTATE': aspnetParameters.viewState,
        '__VIEWSTATEGENERATOR': aspnetParameters.viewStateGenerator,
        '__EVENTVALIDATION': aspnetParameters.eventValidation,
        'DropDownListClasse': inputValues.class,
        'ButtonAfficheClass': inputValues.submitButton,
        'DropDownListProf': inputValues.teacher,
        'DropDownListBranches': inputValues.course,
        'DropDownListSalles': inputValues.classroom
    }

    const form = new FormData();

    for (const key in requestData) {
        form.append(key, requestData[key]);
    }

    const url = "http://apps.hevs.ch/untis/horaireintra.aspx";

    let htmlDocument;

    try {
        const fetchResponse = await fetch(url, {
            method: "POST",
            body: form
        });

        if (!fetchResponse.ok) {
            // TODO: Log error
            return res.status(500).json({ message: `POST request to ${url} failed.`});
        }

        const htmlText = await fetchResponse.text();

        htmlDocument = new jsdom.JSDOM(htmlText).window.document;
    } catch (err) {
        // TODO: Log error
        return res.status(500).json({ message: err.message });
    }

    // Fetch of the schedule HTML page successfull

    let jsonSchedule = {};

    if (isDayDate) {
        console.log('getScheduleForDay');
        jsonSchedule = scheduleUtility.getScheduleForDay(htmlDocument, scheduleDate);
    } else if (isWeekDate) {
        console.log('getScheduleForWeek');
        jsonSchedule = scheduleUtility.getScheduleForWeek(htmlDocument, scheduleDate);
    }

    return res.status(200).json(jsonSchedule);
};

module.exports = { get };
