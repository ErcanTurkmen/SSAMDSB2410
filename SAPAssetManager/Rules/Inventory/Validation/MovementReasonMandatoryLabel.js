import libCom from '../../Common/Library/CommonLibrary';
/**
 * 'Movement Reason *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */
export default function MovementReasonMandatoryLabel(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'movement_reason', true);
}
