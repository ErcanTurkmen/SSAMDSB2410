import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';

export default function ServiceOrderLocalID(context) {
    if (context.binding && context.binding.ObjectID && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return context.binding.ObjectID;
    }

    return GenerateLocalID(context, 'S4ServiceOrders', 'ObjectID', '000', "$filter=startswith(ObjectID, 'LOCAL') eq true", 'LOCAL_S').then(LocalId => {
        libCom.setStateVariable(context, 'LocalId', LocalId);
        return LocalId;
    });
}
