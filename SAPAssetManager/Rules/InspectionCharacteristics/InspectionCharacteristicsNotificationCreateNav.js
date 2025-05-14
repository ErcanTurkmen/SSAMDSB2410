
import common from '../../Rules/Common/Library/CommonLibrary';
import NotificationTypeLstPkrDefault from '../Notifications/NotificationTypePkrDefault';
import QMNotificationDefectType from '../Notifications/QMNotificationDefectType';
import PreloadHierarchyListPickerValues from '../HierarchyControl/PreloadHierarchyListPickerValues';

export default function InspectionCharacteristicsNotificationCreateNav(context) {
    common.setOnCreateUpdateFlag(context, 'CREATE');
   
    let binding = context.getActionResult('ReadResult').data.getItem(0);
    let notifTypePromise = binding.EAMChecklist_Nav ? NotificationTypeLstPkrDefault(context, binding) : QMNotificationDefectType(context, binding);
    return notifTypePromise.then(type => {
        // Add HeaderFunctionLocation and HeaderEquipment to new binding
        // Forces Notification Create page to default pickers
        let newBinding = binding;
        newBinding.HeaderFunctionLocation = binding.InspectionLot_Nav.FunctionalLocation;
        newBinding.HeaderEquipment = binding.InspectionLot_Nav.Equipment;
        newBinding.NotificationType = type;
        context.getPageProxy().setActionBinding(newBinding);
        common.setStateVariable(context, 'LocalId', ''); //Reset before starting create
        common.setStateVariable(context, 'lastLocalItemNumber', '');
     
        if (binding.EAMChecklist_Nav) {
            PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/Notifications/NotificationCreateUpdate.page');
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateUpdateNav.action');
        } else {
            PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/Notifications/QMDefectCreateUpdate.page');
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/QMDefectCreateNav.action');
        }
    });
}
