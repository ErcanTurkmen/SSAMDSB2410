import libVal from '../../Common/Library/ValidationLibrary';

export default function VoyageStatusText(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyageStatusCodeTypes', [], `$filter=VoyageStatusCodeType eq '${context.binding.VoyageStatusCode}'`).then(function(results) {
        if (!libVal.evalIsEmpty(results)) {
            return results.getItem(0).Description;
        }
        return '';
    });
}
