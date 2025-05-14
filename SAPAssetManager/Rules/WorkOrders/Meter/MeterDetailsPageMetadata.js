import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function MeterDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/MeterDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'MeterDetails');
}
