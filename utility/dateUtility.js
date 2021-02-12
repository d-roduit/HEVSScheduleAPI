const toApiParamFormat = (dateToFormat) => {
    const date = new Date(dateToFormat);

    let month = date.getMonth() + 1;
    let day = date.getDate();
    const year = date.getFullYear();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    return `${day}-${month}-${year}`;
}

const toSiteFormat = (dateToFormat) => {
    const date = new Date(dateToFormat);

    let month = date.getMonth() + 1;
    let day = date.getDate();
    const year = date.getFullYear();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    return `${day}.${month}.${year}`;
}

const getWeek = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

module.exports = { toApiParamFormat, toSiteFormat, getWeek };
