import libVal from '../../../Common/Library/ValidationLibrary';

export default function BlockingType(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMPhysicalBlockingTypes', [], `$filter=BlockingType eq '${context.binding.BlockingType}'`).then((data) => {
        if (!libVal.evalIsEmpty(data.getItem(0))) {
            return data.getItem(0).BlockingTypeText;
        }
        return '-';
    });
}
