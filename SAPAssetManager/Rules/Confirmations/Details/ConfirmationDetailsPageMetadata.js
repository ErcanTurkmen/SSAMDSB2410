import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ConfirmationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Confirmations/ConfirmationDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'LaborTimeDetailsSection');
}
