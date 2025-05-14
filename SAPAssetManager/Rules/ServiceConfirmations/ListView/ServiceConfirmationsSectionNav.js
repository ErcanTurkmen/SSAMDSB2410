import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function ServiceConfirmationsSectionNav(context) {
    let query =`$filter=RelatedObjectID eq '${context.binding.ObjectID}'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceConfirmationTranHistories', [], query).then(result => {
        let filter = false;
        if (result.length) {
            filter = result.map(itme => {
                return `ObjectID eq '${itme.ObjectID}'`;
            }).join(' or ');
        }
        S4ServiceLibrary.setConfirmationFilters(context, `$filter=${filter}`);
        let actionBinding = Object.assign({}, context.binding);
        actionBinding.isInitialFilterNeeded = true;
        context.getPageProxy().setActionBinding(actionBinding);
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/List/ConfirmationsListViewNav.action');
    });
}
