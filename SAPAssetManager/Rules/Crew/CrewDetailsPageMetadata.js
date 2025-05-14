import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function CrewDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Crew/CrewMemberDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'CrewMemberDetailsSection');
}
