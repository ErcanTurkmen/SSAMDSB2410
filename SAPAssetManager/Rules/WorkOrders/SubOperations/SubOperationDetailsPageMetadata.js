import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
import SubOperationDetailsPageToOpen from '../../SubOperations/SubOperationDetailsPageToOpen';

export default async function SubOperationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition(SubOperationDetailsPageToOpen(clientAPI));
    return await ModifyKeyValueSection(clientAPI, page, 'WorkOrderSubOperationDetailsSection');
}
