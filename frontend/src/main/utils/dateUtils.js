
const padWithZero = (n) => { return n < 10 ? '0' + n : n; }

const timestampToDate = (timestamp) => {
    var date = new Date(timestamp);
    return (date.getFullYear() + "-" + (padWithZero(date.getMonth()+1)) + "-" + padWithZero(date.getDate()));
}

const daysSinceTimestamp = (date) => {
    var today = new Date();
    var startingDate = new Date(date);
    var timeDiff = Math.abs(today.getTime() - startingDate.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export {timestampToDate, padWithZero, daysSinceTimestamp};