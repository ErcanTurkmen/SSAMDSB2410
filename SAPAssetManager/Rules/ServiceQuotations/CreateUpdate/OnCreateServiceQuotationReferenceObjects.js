import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default async function OnCreateServiceQuotationReferenceObjects(context) {
    let refObject;

    let quotationReadLink = context.binding?.['@odata.readLink'];
    if (quotationReadLink) {
        refObject = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObjects_Nav`, [], '$filter=MainObject eq \'X\'').then(results => results.length ? results.getItem(0) : null);
    }

    // if the reference object exists, perform the update action, otherwise create the reference object
    if (refObject) {
        context.binding.refObjectReadLink = refObject['@odata.readLink'];
        return context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/CreateUpdate/ServiceQuotationRefObjectUpdate.action');
    } else {
        return S4ServiceLibrary.AddS4RefObjects(context, true);
    }
}
