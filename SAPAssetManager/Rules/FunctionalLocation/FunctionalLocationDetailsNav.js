import common from '../Common/Library/CommonLibrary';

const type2flocNavPropName = Object.freeze({
    '#sap_mobile.S4ServiceOrderRefObj': 'FuncLoc_Nav',
    '#sap_mobile.S4ServiceRequestRefObj': 'MyFunctionalLocation_Nav',
});


/** re-read the floc by readlink with expanding the necessary properties.
 * get readlink from the binding or actionbinding
 */
export default function FunctionalLocationDetailsNav(context) {
    const actionBinding = context.getPageProxy().getActionBinding();
    const readlink = (actionBinding?.['@odata.type'] === '#sap_mobile.MyFunctionalLocation' && actionBinding['@odata.readLink']) || context.getPageProxy().binding.FunctionalLocation?.['@odata.readLink'];

    return readlink ? navigateOnRead(context, readlink) : navigate(context, actionBinding);
}


function navigate(context, actionContext) {
    const navPropName = type2flocNavPropName[actionContext['@odata.type']];
    return navPropName ? navigateOnRead(context, actionContext[navPropName]['@odata.readLink']) : Promise.resolve();
}

export function navigateOnRead(context, readlink) {
    const toExpand = '$expand=WorkOrderHeader,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav,WorkCenter_Main_Nav';
    const navAction = '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action';
    return common.navigateOnRead(context.getPageProxy(), navAction, readlink, toExpand);
}
