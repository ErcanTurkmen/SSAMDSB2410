import GetDateTimeValue from '../../DateTime/GetDateTimeValue';

export default function CertificateValidToDateTime(context) {
    return `${context.localizeText('wcm_valid_to')}: ${GetDateTimeValue(context, 'ValidToDate', 'ValidToTime')}`;
}
