import GetDateTimeValue from '../../DateTime/GetDateTimeValue';
export default function WorkPermitFootnote(context) {
    return  `${GetDateTimeValue(context, 'ValidTo', 'ValidToTime')}`;
}
