import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function MeasurementDocumentDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Measurements/MeasurementDocumentDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValuePairsCurrent');
}
