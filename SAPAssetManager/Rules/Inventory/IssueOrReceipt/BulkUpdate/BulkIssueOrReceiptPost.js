import libCom from '../../../Common/Library/CommonLibrary';
import ODataDate from '../../../Common/Date/ODataDate';
import EmptyStateVariables from './EmptyStateVariables';
import { getUpdatedItemsFromEDT } from './BulkIssueOrReceiptPostUpdate';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import { UpdateDocumentHeader } from '../../InboundOrOutbound/UpdateHeaderCountItems';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import GetMaterialUOM from '../../Common/GetMaterialUOM';
import BulkUpdateValidateIssueOrReceipt from './BulkUpdateValidateIssueOrReceipt';
/*
    This function will be called during final save for bulk update i.e, issue all/receive all.
    Once successful, we navigate to newly created material document and delete all state variables used.
*/
export default function BulkIssueOrReceiptPost(context) {
    const binding = context.binding;
    const materialDocNumber = libCom.getStateVariable(context, 'MaterialDocNumberBulkUpdate');
    const materialDocYear = libCom.getStateVariable(context, 'MaterialDocYearBulkUpdate');
    const query = `$filter=MaterialDocNumber eq '${materialDocNumber}' and MaterialDocYear eq '${materialDocYear}'`;
    let items = getUpdatedItemsFromEDT(context);
    let itemsDeleted = items.filter((item) => !item.Properties.ItemSelection);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', [], query).then(async (results) => {
        if (results.length) {
            const currentMaterialDocument = results.getItem(0);
            binding.TempHeader_DocumentDate = new ODataDate().toLocalDateString();
            binding.TempHeader_MaterialDocYear = currentMaterialDocument.MaterialDocYear;
            binding.TempHeader_PostingDate = currentMaterialDocument.PostingDate;
            binding.TempHeader_HeaderText = currentMaterialDocument.HeaderText;
            binding.TempHeader_DeliveryNote = currentMaterialDocument.RefDocumentNumber;
            binding.TempHeader_Key = materialDocNumber;
            binding.TempHeader_MatDocReadLink = `MaterialDocuments(MaterialDocNumber='${materialDocNumber}',MaterialDocYear='${materialDocYear}')`;
            libCom.removeStateVariable(context, 'SerialNumbers');
            libCom.setStateVariable(context, 'BulkUpdateFinalSave', false);
            //Validate if all selected items have correct data
            return BulkUpdateValidateIssueOrReceipt(context).then((validationResult) => {
                if (!validationResult) {
                    return undefined;
                }
                libCom.setStateVariable(context, 'BulkUpdateFinalSave', true);
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOReceiptUpdateChangeset.action')
                .then(() => DeleteMaterialDocumentItemInLoop(context, itemsDeleted))
                .then(() => UpdateDocumentHeader(context))
                .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action'))
                .then(() => navigateToCreateMaterialDocument(context));
            });
        }
        return undefined;
    });
}

export function navigateToCreateMaterialDocument(context) {
    const materialDocNumber = libCom.getStateVariable(context, 'MaterialDocNumberBulkUpdate');
    const materialDocYear = libCom.getStateVariable(context, 'MaterialDocYearBulkUpdate');
    const queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`MaterialDocNumber eq '${materialDocNumber}' and MaterialDocYear eq '${materialDocYear}'`);
    queryBuilder.addExpandStatement('RelatedItem/PurchaseOrder_Nav,RelatedItem/STO_Nav,RelatedItem/ProductionOrderItem_Nav,RelatedItem/ProductionOrderComponent_Nav,RelatedItem/Reservation_Nav');
                
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', [], queryBuilder.build()).then((results) => {
        if (results.length) {
            EmptyStateVariables(context);
            context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(results.getItem(0));
            context.getPageProxy()?.setActionBinding(results.getItem(0));  
            libCom.setStateVariable(context, 'MaterialDocumentBulkUpdate', results.getItem(0));
            return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction({
                'Name': '/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsIMNav.action',
                'Properties': {
                    '_Type': 'Action.Type.Navigation',
                    'PageToOpen': '/SAPAssetManager/Rules/Inventory/MaterialDocument/MaterialDocumentDetailsPageToOpen.js',
                },
            });
        }
        return undefined;
    });
}


function DeleteMaterialDocumentItemInLoop(context, items) {
    if (items.length === 0) {
        return Promise.resolve(true);
    }
    return items.reduce((prevDelPromise, item) => {
        return prevDelPromise.then(() => {
            context.binding.Temp_MatDocItemDeleteLink = item.OdataBinding['@odata.readLink'];
        })
        .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocumentItem/BulkUpdate/MaterialDocItemDeleteDuringBulkUpdate.action'));
    }, Promise.resolve());
}

export function getQuantityInBaseUOM(context, item) {
    if (ValidationLibrary.evalIsEmpty(item.Properties.UOM)) {
        return item.Properties.Quantity;
    }
    return GetMaterialUOM(context, item.OdataBinding.Material, item.Properties.UOM).then(TempLine_MaterialUOM => {
        if (TempLine_MaterialUOM.BaseUOM !== item.Properties.UOM) {
            return (item.Properties.Quantity * TempLine_MaterialUOM.ConversionFactor);
        } 
        return item.Properties.Quantity;
    });
}

