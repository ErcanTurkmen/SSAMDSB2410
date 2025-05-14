import { EquipmentLibrary as libEquipment } from './EquipmentLibrary';
import Logger from '../Log/Logger';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function EquipmentDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();
    const refreshFromOnlineDetails = !actionContext && libCom.getPageName(context.evaluateTargetPathForAPI('#Page:-Previous')) === 'OnlineSearch';
    if (refreshFromOnlineDetails) {
        actionContext = pageProxy.binding;
    }

    let queryOpts = libEquipment.equipmentDetailsQueryOptions();
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AssetCentral.global').getValue())) {
        queryOpts = libEquipment.equipmentDetailsWithAssetCentralQueryOptions();
    }
    
    let readLink = actionContext['@odata.readLink'];
    if (actionContext['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrderRefObj.global').getValue() 
            || actionContext['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceQuotationRefObj.global').getValue()) {
        if (!actionContext.Equipment_Nav) return Promise.resolve();
        readLink = actionContext.Equipment_Nav['@odata.readLink'];
    }
    if (actionContext['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequestRefObj.global').getValue()) {
        if (!actionContext.MyEquipment_Nav) return Promise.resolve();
        readLink = actionContext.MyEquipment_Nav['@odata.readLink'];
    }
    if (actionContext['@odata.type'] === '#sap_mobile.Equipment') {
        readLink = `My${readLink}`;
    }
    //Rebind the necessary equipment data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], queryOpts).then(Equipment => {
        pageProxy.setActionBinding(Equipment.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    });
}
