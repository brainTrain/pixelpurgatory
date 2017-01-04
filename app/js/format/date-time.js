
export const stringToObject = (rawDateTime) => {
    var dateTimeFormat = rawDateTime.split(/[^0-9]/),
        dateTimeObject = new Date(dateTimeFormat[0],dateTimeFormat[1]-1,dateTimeFormat[2],dateTimeFormat[3],dateTimeFormat[4],dateTimeFormat[5]);

    return dateTimeObject;
};
