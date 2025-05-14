import GetGeometryInformation from '../Common/GetGeometryInformation';
import libCommon from '../Common/Library/CommonLibrary';

export default function FunctionalLocationMapNav(context) {
    // close the page and return if coming from the MapExtensionControlPage
    if (context._page && context._page.previousPage &&
        context._page.previousPage.definition.name.includes('MapExtensionControlPage')) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            context.getPageProxy().setActionBinding(context.getPageProxy().getClientData().geometry);
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
        }
    } else {
        return GetGeometryInformation(context.getPageProxy(), 'FuncLocGeometries').then(function(value) {
            if (value && Object.keys(value).length > 0) {
                // create-update
                if (libCommon.getPageName(context) === 'FunctionalLocationCreateUpdatePage') {
                    const onCreate = libCommon.IsOnCreate(context);
                    if (onCreate) {
                        return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapCreateNav.action');
                    } else {
                        // set action binding for edit case, if returned geometry is for equipment
                        if (value['@odata.type']=== '#sap_mobile.MyFunctionalLocation') {
                            context.getPageProxy().setActionBinding(value);
                        }
                        return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapUpdateNav.action');
                    }
                }

                context.getPageProxy().setActionBinding(value);
                return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
            }
            // create
            if (libCommon.getPageName(context) === 'FunctionalLocationCreateUpdatePage') {
                return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapCreateNav.action');
            }
            return null;
        });
    }
}
