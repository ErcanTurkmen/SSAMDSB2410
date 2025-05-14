import libCom from '../../Common/Library/CommonLibrary';

/**
 * 'Add serial number *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */
export default function AddSerialNumMandatoryTitle(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'serial_add_serial_number', true);
}
