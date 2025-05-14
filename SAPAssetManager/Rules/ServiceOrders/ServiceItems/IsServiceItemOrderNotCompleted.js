import S4ServiceLibrary from '../S4ServiceLibrary';

export default function IsServiceItemOrderNotCompleted(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return S4ServiceLibrary.isServiceObjectCompleted(context, context.binding).then(isCompleted => {
            return !isCompleted;
        });
    }

    let entity = context.binding['@odata.readLink'] + '/S4ServiceOrder_Nav';
    let query = '$expand=MobileStatus_Nav';

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], query).then(result => {
        if (result.length) {
            let order = result.getItem(0);
            return S4ServiceLibrary.isServiceObjectCompleted(context, order, order.MobileStatus_Nav).then(isCompleted => {
                return !isCompleted;
            });
        }

        return true;
    });

}
