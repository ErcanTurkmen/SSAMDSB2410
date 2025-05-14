import libCom from '../../Common/Library/CommonLibrary';
import MovementTypeEditable from './MovementTypeEditable';

/**
 * 'Movement Type *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */

export default function GetMovementTypeMandatoryCaption(context) {
   return Promise.resolve(MovementTypeEditable(context)).then(isEditable => libCom.formatCaptionWithRequiredSign(context, 'movement_type', !!isEditable));
}
