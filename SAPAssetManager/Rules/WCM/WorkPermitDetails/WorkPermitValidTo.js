import GetDateTimeValue from '../../DateTime/GetDateTimeValue';

export default function WorkPermitValidTo(context) {
    return `${context.localizeText('valid_to')}: ${GetDateTimeValue(context, 'ValidTo', 'ValidToTime')}`;
}
