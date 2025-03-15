import moment from "moment";

export const getTimestamp =() =>  moment().utc().format('YYYY-MM-DD hh:mm:ss')