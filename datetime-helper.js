
const getWordedWeekDay = (weekIndex) => {

    let wordedDayOfWeek;

    switch (weekIndex) {
        case 0:
            wordedDayOfWeek = 'Sun'
            break;
        case 1:
            wordedDayOfWeek = 'Mon'
            break;
        case 2:
            wordedDayOfWeek = 'Tue'
            break;
        case 3:
            wordedDayOfWeek = 'Wed'
        case 4:
            wordedDayOfWeek = 'Thur'
            break;
        case 5:
            wordedDayOfWeek = 'Fri'
            break;
        case 6:
            wordedDayOfWeek = 'Sat'
            break;
    }

    return wordedDayOfWeek;
}


const getWordedMonth = (monthIndex) => {

    let wordedMonth;

    switch (monthIndex) {
        case 0:
            wordedMonth = 'Jan'
            break;
        case 1:
            wordedMonth = 'Feb'
            break;
        case 2:
            wordedMonth = 'Mar'
            break;
        case 3:
            wordedMonth = 'Apr'
            break;
        case 4:
            wordedMonth = 'May'
            break;
        case 5:
            wordedMonth = 'Jun'
            break;
        case 6:
            wordedMonth = 'Jul'
            break;
        case 7:
            wordedMonth = 'Aug'
            break;
        case 8:
            wordedMonth = 'Sep'
            break;
        case 9:
            wordedMonth = 'Oct'
            break;
        case 10:
            wordedMonth = 'Nov'
            break;
        case 11:
            wordedMonth = 'Dec'
            break;
    }

    return wordedMonth;
}


const formatDate = (aDate) => {

    let sd = new Date(aDate);
    let formatedDate = `${sd.getHours()}:${sd.getMinutes()}, ${getWordedWeekDay(sd.getDay())}, ${getWordedMonth(sd.getMonth())} ${sd.getDate()}, ${sd.getFullYear()}`

    return formatedDate;
}


export { getWordedWeekDay, getWordedMonth, formatDate }