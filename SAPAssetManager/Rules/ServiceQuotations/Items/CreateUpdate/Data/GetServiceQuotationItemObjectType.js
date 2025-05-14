import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default async function GetServiceQuotationItemObjectType(context) {
    const lastLocalItemId = CommonLibrary.getStateVariable(context, 'lastLocalItemId');
    const localServiceOrderID = CommonLibrary.getStateVariable(context, 'LocalId');
    const objectType = CommonLibrary.getStateVariable(context, 'LocalObjectType');

    const createdItemReadLink = `S4ServiceQuotationItems(ObjectID='${localServiceOrderID}',ItemNo='${lastLocalItemId}',ObjectType='${objectType}')`;
    const quotationItem = await context.read('/SAPAssetManager/Services/AssetManager.service', createdItemReadLink, ['ItemObjectType'], '').then(result => result.length ? result.getItem(0) : {});
    return quotationItem.ItemObjectType || '';
}
