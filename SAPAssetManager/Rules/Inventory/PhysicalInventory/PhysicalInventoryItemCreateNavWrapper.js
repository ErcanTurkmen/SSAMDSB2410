import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryItemCreateNavWrapper(context) {
    //Reset serial number state variables
    libCom.setStateVariable(context, 'NewSerialMap', new Map());
    libCom.removeStateVariable(context, 'OldSerialRows');
    const page = context.getPageDefinition('/SAPAssetManager/Pages/Inventory/PhysicalInventory/PhysicalInventoryItemCreateUpdate.page');
    return context.executeAction({
        Name: '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryItemCreateNav.action',
        Properties: {
            PageToOpen: '',
            PageMetadata: page,  // hack: cannot navigate to the same modal page with PageToOpen
            ClearHistory: true,
        },
    });
}
