
export default function SetDocumentTypeValue(context) {
    let type = context.getGlobalDefinition('/SAPAssetManager/Globals/PurchaseRequisition/DefaultDocumentType.global').getValue();

    if (context.binding && context.binding.DocType) {
        type = context.binding.DocType;
    }

    return type;
}
