import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function WorkApprovalDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WCM/WorkApprovals/WorkApprovalDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WorkApprovalDetailsSection');
}
