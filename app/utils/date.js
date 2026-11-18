import moment from "moment";

export const getTimestamp =() =>  moment().utc().format('YYYY-MM-DD HH:mm:ss')
