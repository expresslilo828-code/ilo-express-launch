// Utility function to format time from 24-hour to 12-hour with AM/PM
export const formatTimeTo12Hour = (time24: string): string => {
    if (!time24) return time24;

    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);

    if (isNaN(hour)) return time24;

    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${hour12}:${minutes} ${period}`;
};
