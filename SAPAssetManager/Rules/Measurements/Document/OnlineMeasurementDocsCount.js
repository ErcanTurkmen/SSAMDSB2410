export default function OnlineMeasurementDocsCount(clientAPI) {
    let point = clientAPI.getPageProxy().binding?.Point;
    return clientAPI.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'MeasurementDocuments', `$filter=Point eq '${point}'`);
}
