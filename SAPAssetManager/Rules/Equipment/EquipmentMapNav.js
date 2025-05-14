import GetGeometryInformation from '../Common/GetGeometryInformation';
import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default async function EquipmentMapNav(context) {
    // close the page and return if coming from the MapExtensionControlPage
    if (context._page && context._page.previousPage &&
        context._page.previousPage.definition.name.includes('MapExtensionControlPage')) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

    const pageProxy = context.getPageProxy();
    const clientData = pageProxy.getClientData();
    const isFromEquipmentCreateUpdatePage = libCommon.getPageName(pageProxy) === 'EquipmentCreateUpdatePage';

    if (clientData.geometry && Object.keys(clientData.geometry).length) {
        pageProxy.setActionBinding(clientData.geometry);
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
    }

    if (isFromEquipmentCreateUpdatePage && libCommon.IsOnCreate(context)) { 
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapCreateNav.action');
    }

    const geometry = await readEquipmentGeometry(pageProxy);
    if (geometry?.EquipGeometries?.[0]?.Geometry) {
        if (isFromEquipmentCreateUpdatePage) {
            // set action binding for edit case, if returned geometry is for equipment
            if (geometry['@odata.type']=== '#sap_mobile.MyEquipment') {
                pageProxy.setActionBinding(geometry);
            }
            return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapUpdateNav.action');
        }

        pageProxy.setActionBinding(geometry);
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
    }
            
    if (isFromEquipmentCreateUpdatePage) {
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapCreateNav.action');
    }

    return Promise.resolve();
}

function readEquipmentGeometry(pageProxy) {
    return GetGeometryInformation(pageProxy, 'EquipGeometries')
        .catch(error => {
            Logger.error('readEquipmentGeometry', error);
            return null;
        });
}
