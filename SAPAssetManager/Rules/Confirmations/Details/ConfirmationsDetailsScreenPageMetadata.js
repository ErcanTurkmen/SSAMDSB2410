import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ConfirmationsDetailsScreenPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Confirmations/Details/ConfirmationsDetailsScreen.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ConfirmationDetails');
}
