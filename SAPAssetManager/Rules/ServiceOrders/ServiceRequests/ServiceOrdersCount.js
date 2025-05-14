import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceOrdersCount(sectionProxy) {
    let binding = (sectionProxy.getPageProxy ? sectionProxy.getPageProxy().binding : sectionProxy.binding);
    let readLink = binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(sectionProxy, readLink + '/OrderTransHistory_Nav', '$expand=S4ServiceOrder_Nav');
}
