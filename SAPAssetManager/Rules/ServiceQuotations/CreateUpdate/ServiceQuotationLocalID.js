import GenerateLocalID from '../../Common/GenerateLocalID';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceQuotationLocalID(context) {
    const binding = context.binding || {};
    if (binding.ObjectID && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceQuotation.global').getValue()) {
        return context.binding.ObjectID;
    }

    return GenerateLocalID(context, 'S4ServiceQuotations', 'ObjectID', '000', "$filter=startswith(ObjectID, 'LOCAL') eq true", 'LOCAL_S').then(localId => {
        CommonLibrary.setStateVariable(context, 'LocalId', localId);
        return localId;
    }); 
}
