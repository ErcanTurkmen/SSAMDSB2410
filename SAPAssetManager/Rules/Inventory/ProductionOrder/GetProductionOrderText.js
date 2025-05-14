import libEval from '../../Common/Library/ValidationLibrary';

export default function GetProductionOrderText(context) {
    let binding = context.binding;
    let filter = "$filter=(OrderID eq '"+binding.OrderId+"')";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ProductionOrderTexts', ['TextString'], filter).then( results => {
        if (!libEval.evalIsEmpty(results)) {
            return results.getItem(0).TextString;
        }
        return ' ';
    });
}
