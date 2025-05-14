import libCommon from '../../Common/Library/CommonLibrary';
import personaLibrary from '../../Persona/PersonaLibrary';
import partIssueUpdateNav from '../../Parts/Issue/PartIssueUpdateNav';
import setMaterialDocumentGoodsReceipt from './SetMaterialDocumentGoodsReceipt';

export default function MaterialDocumentUpdateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    let queryOption = '$expand=RelatedItem&$orderby=RelatedItem/MatDocItem asc';
    if (personaLibrary.isInventoryClerk(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.getBindingObject()['@odata.readLink'], [],queryOption).then(results => {
            const hasResult = checkHasResult(results);
            if (hasResult) {
                let materialDocument = results.getItem(0);
                const hasRelatedItem = checkRelatedItem(materialDocument);
                if (hasRelatedItem) {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', materialDocument.RelatedItem[0]['@odata.readLink'], [],'$expand=InboundDeliveryItem_Nav,OutboundDeliveryItem_Nav,PurchaseOrderItem_Nav,ReservationItem_Nav,StockTransportOrderItem_Nav,AssociatedMaterialDoc').then(itemResults => {
                        if (itemResults && itemResults.length > 0) {
                            let materialDocumentItem = itemResults.getItem(0);
                            context.getPageProxy().setActionBinding(materialDocumentItem);
                            return setMaterialDocumentGoodsReceipt(context);
                        }
                        return true;
                    });
                }
            }
            return true;
        });
    }
    return partIssueUpdateNav(context);
}

function checkHasResult(results) {
    return results && results.length > 0;
}

function checkRelatedItem(materialDocument) {
    return materialDocument.RelatedItem && materialDocument.RelatedItem.length > 0;
}
