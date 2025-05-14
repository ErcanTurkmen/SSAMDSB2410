import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function PeriodicRegisterDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/Periodic/RegisterDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ReadingDetails');
}
