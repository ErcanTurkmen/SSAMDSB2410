import GetGeometryInformation from '../Common/GetGeometryInformation';
import libCommon from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

export default function NotificationMapNav(context) {
    // close the page and return if coming from the MapExtensionControlPage
    if (context._page && context._page.previousPage &&
        context._page.previousPage.definition.name.includes('MapExtensionControlPage')) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            context.getPageProxy().setActionBinding(context.getPageProxy().getClientData().geometry);
            return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMapNav.action');
        }
    // Otherwise, determine if we should have geometry data
    } else {
        const onCreate = libCommon.IsOnCreate(context);
        return GetGeometryInformation(context.getPageProxy(), 'NotifGeometries').then(function(value) {
            if (value && Object.keys(value).length > 0) {
                // create-update
                if (libCommon.getPageName(context) === 'NotificationAddPage') {
                    if (onCreate) {
                        return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMapCreateNav.action');
                    } else {
                        // set action binding for edit case, if returned geometry is for notification
                        if (value['@odata.type']=== '#sap_mobile.MyNotificationHeader') {
                            context.getPageProxy().setActionBinding(value);
                        }
                        return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMapUpdateNav.action');
                    }
                }

                // set action binding to the geometry info, so the map page can display it
                context.getPageProxy().setActionBinding(value);
                if (value['@odata.type']=== '#sap_mobile.MyFunctionalLocation' && !ValidationLibrary.evalIsEmpty(value.FuncLocGeometries) && value.FuncLocGeometries[0].Geometry) {
                    return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
                }
                if (value['@odata.type']=== '#sap_mobile.MyEquipment' && !ValidationLibrary.evalIsEmpty(value.EquipGeometries) && value.EquipGeometries[0].Geometry) {
                    return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
                }
                
                return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMapNav.action');
            }
            // create
            if (libCommon.getPageName(context) === 'NotificationAddPage') {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMapCreateNav.action');
            }
            return null;
        });
    }
}
