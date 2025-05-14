import GetDateTimeValue from '../../DateTime/GetDateTimeValue';

export default function ValidFromSlashValidTo(context) {
    return `${GetDateTimeValue(context, 'ValidFrom', 'ValidFromTime')}\n` +
        `${GetDateTimeValue(context, 'ValidTo', 'ValidToTime')}`;
}
