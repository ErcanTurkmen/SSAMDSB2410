import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default async function GetServiceQuotationItemLinkForStatus(context) {
    const itemId = CommonLibrary.getStateVariable(context, 'lastLocalItemId');
    const objectID = CommonLibrary.getStateVariable(context, 'LocalId');
    const objectType = CommonLibrary.getStateVariable(context, 'LocalObjectType');
    return `S4ServiceQuotationItems(ItemNo='${itemId}',ObjectID='${objectID}',ObjectType='${objectType}')`;
}
