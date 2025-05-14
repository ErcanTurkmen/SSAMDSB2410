import ODataDate from '../../../Common/Date/ODataDate';

/**
   * Format the time coming as "100300" to first converting to appropriate format
   * and then changing it from backend to local format.
   * @returns {Date} returns the date time object with correct time format
   * 
   */
export default function CharacteristicsFormatBackendTimeToLocal(time) {
    let timeString = time.toString();
    timeString = `${timeString.slice(0,2)}:${timeString.slice(2,4)}:${timeString.slice(4)}`;
    let odataDate = new ODataDate(undefined, timeString);
    return odataDate.date();
}
