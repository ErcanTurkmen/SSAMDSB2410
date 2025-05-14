import GenerateLocalID from '../../../Common/GenerateLocalID';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceConfirmationItemLocalID(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmationItem') {
        return Promise.resolve(context.binding.ItemNo);
    }

    let localId = CommonLibrary.getStateVariable(context, 'LocalItemId');
    if (localId) return Promise.resolve(localId);

    if (CommonLibrary.isOnChangeset(context)) {
        localId = '000010';
        CommonLibrary.setStateVariable(context, 'LocalItemId', localId);
        return Promise.resolve(localId);
    }

    let confirmationId = CommonLibrary.getStateVariable(context, 'LocalId');
    return GenerateLocalID(context, 'S4ServiceConfirmationItems', 'ItemNo', '00000', `$filter=ObjectID eq '${confirmationId}'`, '', 'ItemNo', 9).then(id => {
        CommonLibrary.setStateVariable(context, 'LocalItemId', id);
        return id;
    });
}
