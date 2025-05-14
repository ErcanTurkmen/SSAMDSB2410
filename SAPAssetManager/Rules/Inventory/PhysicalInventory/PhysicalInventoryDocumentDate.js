import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PhysicalInventoryDocumentDate(context) {
    const control = libCom.getControlProxy(context,'CountDatePicker');
    const countDate = control?.getValue() || context.binding?.CountDate;
    return new ODataDate(countDate).toLocalDateString();
}
