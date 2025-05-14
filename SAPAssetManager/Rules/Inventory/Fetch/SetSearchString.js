import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SetSearchString(context) {
    return libCom.getStateVariable(context, 'SearchString');
}
