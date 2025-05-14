import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function RegisterDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/Register/RegisterDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ReadingDetails');
}
