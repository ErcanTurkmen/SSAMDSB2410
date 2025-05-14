/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../../../Common/Library/CommonLibrary';
export default function EntryQuantity(context) {
    return libCom.getStateVariable(context, 'EntryQuantity') || 0;
}
