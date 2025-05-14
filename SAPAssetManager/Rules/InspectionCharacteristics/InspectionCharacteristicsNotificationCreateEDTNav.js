
import common from '../Common/Library/CommonLibrary';
import NotificationTypeLstPkrDefault from '../Notifications/NotificationTypePkrDefault';
import QMNotificationDefectType from '../Notifications/QMNotificationDefectType';
import PreloadHierarchyListPickerValues from '../HierarchyControl/PreloadHierarchyListPickerValues';

export default function InspectionCharacteristicsNotificationCreateEDTNav(context) {
    let clientAPI = context._control.getTable().context.clientAPI;
    common.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    let binding = context.binding;
    let notifTypePromise = binding.EAMChecklist_Nav ? NotificationTypeLstPkrDefault(clientAPI, binding) : QMNotificationDefectType(clientAPI, binding);
    return notifTypePromise.then(type => {
        // Add HeaderFunctionLocation and HeaderEquipment to new binding
        // Forces Notification Create page to default pickers
        let newBinding = binding;
        newBinding.HeaderFunctionLocation = binding.InspectionLot_Nav?.FunctionalLocation || binding.EAMChecklist_Nav?.FunctionalLocation;
        newBinding.HeaderEquipment =  binding.InspectionLot_Nav?.Equipment || binding.EAMChecklist_Nav?.Equipment;
        newBinding.NotificationType = type;
        clientAPI.getPageProxy().setActionBinding(newBinding);
        common.setStateVariable(clientAPI, 'LocalId', ''); //Reset before starting create
        common.setStateVariable(clientAPI, 'lastLocalItemNumber', '');

        if (binding.EAMChecklist_Nav) {
            PreloadHierarchyListPickerValues(clientAPI, '/SAPAssetManager/Pages/Notifications/NotificationCreateUpdate.page');
            return clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateUpdateNav.action');
        } else {
            PreloadHierarchyListPickerValues(clientAPI, '/SAPAssetManager/Pages/Notifications/QMDefectCreateUpdate.page');
            return clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/QMDefectCreateNav.action');
        }
    });
}
