import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
import ServiceItemDetailsPageToOpen from './ServiceItemDetailsPageToOpen';

export default async function ServiceItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition(ServiceItemDetailsPageToOpen(clientAPI));
    return await ModifyKeyValueSection(clientAPI, page, 'ServiceItemDetailsSection');
}
