import libPart from './PartLibrary';
import Logger from '../Log/Logger';

export default function PartsIssueEDTQuantityValue(context, binding = undefined) {
    const requirementQuantity = binding ? binding.QuantityUnE : context?.binding?.QuantityUnE;
    const withdrawnQuantity = binding ? binding.WithdrawnQuantity : context?.binding?.WithdrawnQuantity;
    return libPart.getLocalQuantityIssued(context, binding ? binding : context.binding).then(result => {
        return requirementQuantity - (withdrawnQuantity + result);
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), error);
        return requirementQuantity;
    });
}
