import libCom from '../../Common/Library/CommonLibrary';
import DocumentCreateBDS from '../../Documents/Create/DocumentCreateBDS';
import { checkAdhocReceiptAbility } from '../IssueOrReceipt/IssueOrReceiptCreateUpdatePost';
import createIssueorReceiptSignature from '../IssueOrReceipt/IssueOrReceiptSignatureCreate';
import libVal from '../../Common/Library/ValidationLibrary';
import { InventoryOrderTypes, InventoryDocumentHeaderStatus } from '../Common/Library/InventoryLibrary';

export default function UpdateHeaderCountItems(context, type, docInfo) {
    try {
        return UpdateDocumentHeader(context, type, docInfo);
    } finally {
        let objectType = libCom.getStateVariable(context, 'IMObjectType');
        if (!checkAdhocReceiptAbility(objectType)) {
            //Set the global TransactionType variable to CREATE
            libCom.setOnCreateUpdateFlag(context, 'CREATE');

                // create media and signature
                DocumentHelper(context)
                .then(() =>libCom.setOnCreateUpdateFlag(context, ''))
                .then(() => createIssueorReceiptSignature(context));
                
        }
    }
}

/**
 * This function determines and sets the document header status based on the number of items that are partially issued/received (picked) or completed.
 */
export function UpdateDocumentHeader(context, type, docInfo) {
    const binding = docInfo || context.binding;
    if (!binding) {
        return Promise.resolve();
    }

    type = type || libCom.getStateVariable(context, 'IMObjectType');

    const [entitySet, readLink, readLinkItems] = getEntitySetReadLink(binding, type);
    if (!entitySet) {
        return Promise.resolve();
    }
    
    //Loop over all line items to determine header status
    return context.read('/SAPAssetManager/Services/AssetManager.service', readLinkItems, [], '').then(itemResults => {
        if (libVal.evalIsEmpty(itemResults)) {
            return Promise.resolve();
        }
        let items = Array.from(itemResults);
        switch (type) {
            case InventoryOrderTypes.PO:
                items = items.map(item => ({required: item.OrderQuantity, completed: item.ReceivedQuantity}));
                break;
            case InventoryOrderTypes.STO:
                items = items.map(item => ({required: item.OrderQuantity, completed: item.IssuedQuantity}));
                break;
            case InventoryOrderTypes.RES:
                items = items.map(item => ({required: item.RequirementQuantity, completed: item.WithdrawalQuantity}));
                break;
            default:
        }
        const pickedItems = items.filter(item => item.required > 0 && item.completed > 0);
        const fullyPickedItems = pickedItems.filter(pickedItem => pickedItem.required === pickedItem.completed);
        let status = InventoryDocumentHeaderStatus.Open;
        if (fullyPickedItems.length === itemResults.length) { //Determine header status
            status = InventoryDocumentHeaderStatus.Completed;
        } else if (pickedItems.length) {
            status = InventoryDocumentHeaderStatus.Partial;
        }

        // Update Delivery
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
            'Target': {
                'EntitySet': entitySet,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': readLink,
            },
            'Properties': {
                'DocumentStatus': status,
            },
            'Headers': {
                'Transaction.Ignore': 'true',
            },
        }}).then(() => {
            return Promise.resolve(status);
        });
    });
}

function getEntitySetReadLink(binding, type) {
    let entitySet, readLink, readLinkItems;
    switch (type) {
        case 'PO':
            entitySet = 'PurchaseOrderHeaders';
            readLink = binding.PurchaseOrderHeader_Nav ? binding.PurchaseOrderHeader_Nav['@odata.readLink'] : binding['@odata.readLink'];
            readLinkItems = readLink + '/PurchaseOrderItem_Nav';
            break;
        case 'STO':
            entitySet = 'StockTransportOrderHeaders';
            readLink = binding.StockTransportOrderHeader_Nav ? binding.StockTransportOrderHeader_Nav['@odata.readLink'] : binding['@odata.readLink'];
            readLinkItems = readLink + '/StockTransportOrderItem_Nav';
            break;
        case 'RES':
            entitySet = 'ReservationHeaders';
            readLink = binding.ReservationHeader_Nav ? binding.ReservationHeader_Nav['@odata.readLink'] : binding['@odata.readLink'];
            readLinkItems = readLink + '/ReservationItem_Nav';
            break;            
    }
    return [entitySet, readLink, readLinkItems];
}

export function DocumentHelper(context) {
    if (libCom.getStateVariable(context,'attachmentCount') > 0) {
        return DocumentCreateBDS(context, libCom.getStateVariable(context, 'Doc'));
    }
    return Promise.resolve();

}
