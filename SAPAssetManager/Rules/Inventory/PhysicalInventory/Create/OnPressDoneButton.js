import libCom from '../../../Common/Library/CommonLibrary';

export default function OnPressDoneButton(context) {
    libCom.setStateVariable(context, 'PIDoneButtonPressed', true);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateUpdateRequired.action');
}
