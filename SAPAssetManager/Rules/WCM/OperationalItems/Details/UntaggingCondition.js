import libVal from '../../../Common/Library/ValidationLibrary';

export default function UntaggingCondition(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMOpConditions', [], `$filter=OpCondition eq '${context.binding.UntagCond}'`).then((data) => {
        if (!libVal.evalIsEmpty(data.getItem(0))) {
            return data.getItem(0).OpConditionText;
        }
        return '-';
    });
}
