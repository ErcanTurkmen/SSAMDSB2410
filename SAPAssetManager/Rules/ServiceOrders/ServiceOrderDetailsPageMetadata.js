import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';
import ServiceOrderDetailsPageToOpen from './ServiceOrderDetailsPageToOpen';

export default async function ServiceOrderDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition(ServiceOrderDetailsPageToOpen(clientAPI));
    return await ModifyKeyValueSection(clientAPI, page, 'OrderDetailsSection');
}
