import dateTime from './CharacteristicsFormatBackendTimeToLocal';
import fixTime from './CharacteristicFixTime';
import ODataDate from '../../../Common/Date/ODataDate';

export default function CharacteristicsTimeDisplayValue(context, time) {
    let timeStamp = ODataDate.fromTimestamp(time, context);
    let localTime = timeStamp.toLocalTimeString(context).replace(/:/g,'');
    let timeString = localTime.toString();
    if (timeString === '0') return '0';

    timeString = fixTime(timeString);
    return context.formatTime(dateTime(timeString));
}
