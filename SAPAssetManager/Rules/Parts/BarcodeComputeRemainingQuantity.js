import libPart from './PartLibrary';
import Logger from '../Log/Logger';

export default function BarcodeComputeRemainingQuantity(context) {
    let requirementQuantity = context.binding.QuantityUnE;
    let withdrawnQuantity = context.binding.WithdrawnQuantity;
    return libPart.getLocalQuantityIssued(context, context.binding).then(result => {
        return requirementQuantity - (withdrawnQuantity + result);
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), error);
        return requirementQuantity;
    });
}
