import NotificationCreateChangeSetNav from '../../Notifications/CreateUpdate/NotificationCreateChangeSetNav';

export default async function WCMQABCreateNotification(context) {
    let headerFunctionLocation;
    let headerEquipment;
    const binding = context.binding;

    switch (binding['@odata.type']) {
        case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue()):
        case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue()):    
            headerFunctionLocation = binding.FuncLocIdIntern;
            headerEquipment = binding.EquipId;
            break;
        case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue()):
        case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue()): {
            const result = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}`, [], '$expand=MyFunctionalLocations,MyEquipments');
            const item = result.getItem(0);
            headerFunctionLocation = item.MyFunctionalLocations && item.MyFunctionalLocations.FuncLocIdIntern;
            headerEquipment = item.MyEquipments && item.MyEquipments.EquipId;
            break;  
        }
        case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()):
            headerFunctionLocation = binding.HeaderFunctionLocation;
            headerEquipment = binding.HeaderEquipment;
            break;   
        default:
            break;    
    }

    return NotificationCreateChangeSetNav(context, { HeaderFunctionLocation: headerFunctionLocation, HeaderEquipment: headerEquipment });
}
