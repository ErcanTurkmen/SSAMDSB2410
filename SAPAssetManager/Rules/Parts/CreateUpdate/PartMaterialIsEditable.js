export default function PartMaterialIsEditable(context) {
    return context.binding['@odata.type'] !== context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue();
}
