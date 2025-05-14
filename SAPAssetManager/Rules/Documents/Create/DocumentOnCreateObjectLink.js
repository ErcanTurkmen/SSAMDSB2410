import ComLib from '../../Common/Library/CommonLibrary';
import getDocsData from './DocumentOnCreateGetStateVars';

export default function DocumentOnCreateObjectLink(controlProxy) {
    const { Class, ObjectLink, parentEntitySet } = getDocsData(controlProxy);
    let paramGroupName = 'DOCUMENT';

    if (ComLib.isDefined(ObjectLink)) {
        return ObjectLink;
    }

    if (['S4ServiceOrders', 'S4ServiceConfirmations', 'S4ServiceRequests', 'S4ServiceQuotations'].includes(parentEntitySet)) {
        paramGroupName = 'S4OBJECTTYPE';
    }
    
    let value = ComLib.getAppParam(controlProxy, paramGroupName, Class);
    return value ? value : '';
}
