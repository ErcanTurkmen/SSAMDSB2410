import libCommon from '../../Common/Library/CommonLibrary';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';

export default function FunctionalLocationCreateNav(context) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    
    context.getPageProxy().setActionBinding({});
  
    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/FunctionalLocation/FunctionalLocationCreateUpdate.page');
    return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreateChangeset.action');
}
