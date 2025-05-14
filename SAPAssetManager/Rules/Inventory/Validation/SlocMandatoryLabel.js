import libCom from '../../Common/Library/CommonLibrary';
/**
 * 'Storage location *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */
export default function SlocMandatoryLabel(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'storage_location', true);
}
