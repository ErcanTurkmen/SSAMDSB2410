import libCom from '../../Common/Library/CommonLibrary';
/**
 * Batch lable '*' with mandatory indicator implementation
 * @param {IClientAPI} context 
 * @returns {String} formated string with mandatory sign
 */
export default function BatchFromLabel(context) {
    const type = libCom.getStateVariable(context, 'IMMovementType');
    const label = type === 'T' ?  'from_batch' : 'batch';
    return libCom.formatCaptionWithRequiredSign(context, label, true);
}
