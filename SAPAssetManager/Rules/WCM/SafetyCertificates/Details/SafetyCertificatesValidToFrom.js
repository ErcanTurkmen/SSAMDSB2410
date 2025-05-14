import GetDateTimeValue from '../../../DateTime/GetDateTimeValue';

export default function SafetyCertificatesValidToFrom(context) {
    return `${GetDateTimeValue(context, 'ValidFromDate', 'ValidFromTime')}\n` +
        `${GetDateTimeValue(context, 'ValidToDate', 'ValidToTime')}`;
}
