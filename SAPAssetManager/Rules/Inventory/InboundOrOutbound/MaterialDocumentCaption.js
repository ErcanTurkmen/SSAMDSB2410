import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import libInv from '../../Inventory/Common/Library/InventoryLibrary';
/**
* This function returns the Material Document caption with count...
* @param {IClientAPI} context
*/
export default async function MaterialDocumentCaption(context) {
    let baseQuery = "IMObject eq 'MDOC'";
    let baseQueryFilter = '$filter=(' + baseQuery + ')';
    try {
        return await libInv.removeDeletedItems(context,baseQueryFilter)
        .then(filter => libCom.getEntitySetCount(context, 'MyInventoryObjects', filter))
        .then(count => context.localizeText('material_document_title_x', [count]));
    } catch (error) {
        Logger.error('Inventory Overview',  error);
        return context.localizeText('material_document_title'); 
    }
}

