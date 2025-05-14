import libVal from '../../../Common/Library/ValidationLibrary';

export default function TaggingCondition(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMOpConditions', [], `$filter=OpCondition eq '${context.binding.TaggingCond}'`).then((data) => {
        if (!libVal.evalIsEmpty(data.getItem(0))) {
            return data.getItem(0).OpConditionText;
        }
        return '-';
    });
}
