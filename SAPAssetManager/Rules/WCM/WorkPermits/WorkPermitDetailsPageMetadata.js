import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function WorkPermitDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WCM/WorkPermits/WorkPermitDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WorkPermitDetailsSection');
}
