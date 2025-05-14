import libCom from '../../Common/Library/CommonLibrary';
/**
 * 'Vendor *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */
export default function VendorMandatoryLabel(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'vendor', true);
}
