import libCommon from '../../Common/Library/CommonLibrary';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';

export default function WorkOrderOperationUpdateNav(context) {
    let binding = context.binding;
    if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    //Set the global TransactionType variable to UPDATE
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');

    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationCreateUpdate.page');
    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action', binding['@odata.readLink'], '$select=*,EquipmentOperation/EquipId,FunctionalLocationOperation/FuncLocIdIntern&$expand=EquipmentOperation,FunctionalLocationOperation');
}
