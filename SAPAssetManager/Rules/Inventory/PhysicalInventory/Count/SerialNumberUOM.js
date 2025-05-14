/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../../../Common/Library/CommonLibrary';
export default function SerialNumberUOM(context) {
    let entryUOM = '';
    entryUOM = libCom.getStateVariable(context, 'EntryUOM');
    return entryUOM;
}
