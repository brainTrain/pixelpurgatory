
export const stringToDate = (rawDateTime) => {
    /** 
     *  converts a datetime string into a javascript date object
     *  you can't just do new Date('2016-11-10T15:50:42+0000')
     *  because that breaks in Safari.
     *
     *  The regex splits on non-ints
     *  inputs assume rawDateTime is an ISO 8601 format
     *  example: rawDateTime = 2016-11-10T15:50:42+0000
     */
    const dateTimeFormat = rawDateTime.split(/[^0-9]/);
    const [ year, month, day, hours, minutes, seconds ] = dateTimeFormat;
    return new Date(year, month - 1, day, hours, minutes, seconds);
};
