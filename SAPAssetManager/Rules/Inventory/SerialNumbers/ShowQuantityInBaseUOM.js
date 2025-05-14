/**
* This function sets the visibility of the Quantity field
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function ShowQuantityInBaseUOM(context) {
    const target = libCom.getStateVariable(context, 'SerialPageBinding');
    return target.UOMVisible;
}
