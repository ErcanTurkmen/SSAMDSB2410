import libCommon from '../Common/Library/CommonLibrary';
import PreloadHierarchyListPickerValues from '../HierarchyControl/PreloadHierarchyListPickerValues';

export default function SubOperationUpdateNav(context) {
    let binding = context.binding;

    if (context.constructor.name === 'SectionedTableProxy') {
        binding = binding ?? context.getPageProxy().getExecutedContextMenuItem()?.getBinding();
    }
    return SubOperationUpdate(context, binding);
}

export function SubOperationUpdate(context, suboperation) {
    //Set the global TransactionType variable to UPDATE
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');

    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationCreateUpdate.page');
    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationCreateUpdateNav.action', suboperation['@odata.readLink'], '$select=*,EquipmentSubOperation/EquipId,FunctionalLocationSubOperation/FuncLocIdIntern,WorkOrderOperation/WOHeader/OrderId&$expand=EquipmentSubOperation,FunctionalLocationSubOperation,WorkOrderOperation/WOHeader');
}
