import libVal from '../../Common/Library/ValidationLibrary';

export default async function VoyageSubHead(context) {
    const binding = context.binding;
    let voyageTypeDescription = '';
    if (binding.VoyageTypeCode) {
        voyageTypeDescription = await getVoyageTypeDescription(context);
    }
    return [voyageTypeDescription, binding.SourceStage, binding.Supplier].filter((item) => !!item).join(', ');
}

function getVoyageTypeDescription(context) {
    if (context.binding.FldLogsVoyageType_Nav?.Description) {
        return Promise.resolve(context.binding.FldLogsVoyageType_Nav?.Description);
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyageTypeCodes', [], `$filter=VoyageTypeCode eq '${context.binding.VoyageTypeCode}'`).then(function(results) {
        if (!libVal.evalIsEmpty(results)) {
            return results.getItem(0).Description;
        }
        return '';
    });
}
