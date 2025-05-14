import libCom from '../../../Common/Library/CommonLibrary';
import itemsContextStateVariablesSet from '../../MaterialDocument/ItemsContextStateVariablesSet';
import { getUpdatedItemsFromEDT, UpdateMaterialDocumentItemInLoop, setQuantitiesAndReadLinkForDocument } from './BulkIssueOrReceiptPostUpdate';
import { getQuantityInBaseUOM } from './BulkIssueOrReceiptPost';
import IsUoMReadOnly from './EDT/IsUoMReadOnly';

export default async function IssueOrReceiptItemNav(context) {

    const clientAPI = context._control.getTable().context.clientAPI;
    const items = getUpdatedItemsFromEDT(clientAPI);
    const itemsSelected = items.filter((item) => item.Properties.ItemSelection).map(item => item.OdataBinding.MatDocItem);
    libCom.setStateVariable(context, 'BulkUpdateItemSelectionMap', itemsSelected);  
    return UpdateMaterialDocumentItemInLoop(clientAPI.getPageProxy(), items).then(async () => {

        context.binding.EntryQuantity = context._control.getTable().getAllValues()[0].Properties.Quantity;
        context.binding.StorageLocation = context._control.getTable().getAllValues()[0].Properties.StorageLocation;
        context.binding.EntryUOM = context._control.getTable().getAllValues()[0].Properties.UOM;

        let docInfo = context.binding;
        if (docInfo) {      
            libCom.setStateVariable(context, 'ActualDocId', docInfo.MaterialDocNumber);
            let fixedData = {
                headerNote: docInfo.AssociatedMaterialDoc.HeaderText,
                postingDate: docInfo.AssociatedMaterialDoc.PostingDate,
                order: docInfo.OrderNumber,
                salesorder: docInfo.SalesOrderNumber,
                network: docInfo.Network,
                cost_center: docInfo.CostCenter,
                project: docInfo.WBSElement,
            };
            libCom.setStateVariable(context, 'FixedData', fixedData);  
            let params = {
                MovementType: docInfo.MovementType,
                StorageLocation: docInfo.StorageLocation,
                Plant: docInfo.Plant,
                OrderNumber: docInfo.OrderNumber,
            };

            setQuantitiesAndReadLinkForDocument(context.binding, context._control.getTable().getAllValues()[0].OdataBinding); //Set quantities for all different document types - PO, RES, STO, PRD
            context.binding.TempLine_OldQuantity = 0;
            context.binding.TempLine_QuantityInBaseUOM = IsUoMReadOnly(context, context._control.getTable().getAllValues()[0].OdataBinding) ? context._control.getTable().getAllValues()[0].Properties.Quantity : await getQuantityInBaseUOM(context, context._control.getTable().getAllValues()[0]); //If UoM is readonly then baseQuantity will always be same as old

            return itemsContextStateVariablesSet(context, docInfo.MaterialDocNumber, params).then(() => {
                libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink', `MaterialDocuments(MaterialDocNumber='${docInfo.MaterialDocNumber}',MaterialDocYear='${docInfo.MaterialDocYear}')`);
                libCom.setStateVariable(context,'Temp_MaterialDocumentNumber', docInfo.MaterialDocNumber); 
                clientAPI.getPageProxy().setActionBinding(context.binding);
                return clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateUpdateNav.action');
            });         
        }
        return undefined;
     });
}
