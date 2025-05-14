import GenerateLocalID from '../../../Common/GenerateLocalID';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceConfirmationLocalID(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        return Promise.resolve(context.binding.ObjectID);
    }

    let localId = CommonLibrary.getStateVariable(context, 'LocalId');
    if (localId) return Promise.resolve(localId);

    return GenerateLocalID(context, 'S4ServiceConfirmations', 'ObjectID', '00000', "$filter=startswith(ObjectID, 'LOCAL') eq true", 'LOCAL').then(id => {
        CommonLibrary.setStateVariable(context, 'LocalId', id);
        return id;
    });
}
