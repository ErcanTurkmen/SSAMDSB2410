import libCommon from '../../Common/Library/CommonLibrary';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';

export default function EquipmentCreateNav(context) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);

    context.getPageProxy().setActionBinding({});

    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/Equipment/EquipmentCreateUpdate.page');
    return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentCreateChangeset.action');
}
