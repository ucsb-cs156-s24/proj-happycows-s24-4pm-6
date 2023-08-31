
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

const minutesInSeconds = 60;
const hourInSeconds = 60 * minutesInSeconds;
const dayInSeconds = 24 * hourInSeconds;
const weekInSeconds = 7 * dayInSeconds;

export function formatTime(timeString) {
    if (!timeString) {
        return "";
    }

    const now = new Date();
    const dateFromEpoch = new Date(timeString);
    const secondsPast = Math.floor((now - dateFromEpoch) / 1000);

    if (secondsPast < minutesInSeconds * 2) {
        return 'Online now';
    }

    if (secondsPast < hourInSeconds) {
        const minutes = Math.floor(secondsPast / 60);
        return `${minutes} minutes ago`;
    }

    if (secondsPast < dayInSeconds) {
        const hours = Math.floor(secondsPast / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    if (secondsPast < weekInSeconds) {
        const days = Math.floor(secondsPast / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return dateFromEpoch.toLocaleDateString();
}

export {timestampToDate, padWithZero, daysSinceTimestamp};
