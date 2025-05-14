import CommonLibrary from '../Common/Library/CommonLibrary';
/**
 * Creates the query that we use to get the work order object list. We are filtering out assembly objects because they are currently not supported on the client. They are supported by the backend AddOn pack only right now.
 * Used by WorkOrderDetails.page and WorkOrderOperationDetails.page.
 * 
 * @param {*} sectionedTableProxy
 */
export default function ObjectListsCount(sectionedTableProxy) {
    let bindingObj = sectionedTableProxy.getPageProxy().binding;
    let objectListQuery = "$filter=((Assembly eq '') or (Assembly eq null))";
    let readLink = bindingObj['@odata.readLink'];
    
    if (bindingObj && bindingObj['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return CommonLibrary.getEntitySetCount(sectionedTableProxy, readLink + '/RefObjects_Nav', '');
    }
    if (bindingObj && bindingObj['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        return CommonLibrary.getEntitySetCount(sectionedTableProxy, readLink + '/RefObj_Nav', '');
    }
    //Online pages
    if (bindingObj && (bindingObj['@odata.type'] === '#sap_mobile.WorkOrderHeader' || bindingObj['@odata.type'] === '#sap_mobile.WorkOrderOperation')) {
        return CommonLibrary.getEntitySetCount(sectionedTableProxy, readLink + '/ObjectList', '', '/SAPAssetManager/Services/OnlineAssetManager.service');
    }

    return CommonLibrary.getEntitySetCount(sectionedTableProxy, readLink + '/WOObjectList_Nav', objectListQuery);
}
