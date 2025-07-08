import libCommon from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function ZPRTEquipmentAddNavFromSwipe(context) {
    let binding = context.binding;
    if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    
    //Set the global TransactionType variable to UPDATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/PRT/PRTEquipmentCreateUpdateNav.action');
}
