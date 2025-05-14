import CommonLibrary from '../../Common/Library/CommonLibrary';
import libOprMobile from './SubOperationMobileStatusLibrary';

/**
* Unconfirm for context menu
* @param {IClientAPI} context
*/
export default function SubOperationUnconfirmStatus(context) {
    let subOperation = context.getPageProxy().binding;
    // Save operation because it'll get lost later
    if (context.constructor.name === 'SectionedTableProxy' && context.getPageProxy().getExecutedContextMenuItem()) {
        subOperation = context.getClientData().currentObject = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    } else if (context.binding?.['@odata.type'] !== '#sap_mobile.MyWorkOrderSubOperation' && context.getPageProxy().getActionBinding) { // if we're on the operation details page, need to fetch the "binding" suboperation from the actionbinding
        subOperation = context.getPageProxy().getActionBinding() ?? subOperation;
        CommonLibrary.setStateVariable(context, 'BINDINGOBJECT', subOperation);
    }
    return libOprMobile.unconfirmSubOperation(context, subOperation);
}
