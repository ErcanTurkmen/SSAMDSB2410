import libCom from '../../../Common/Library/CommonLibrary';
import ODataDate from '../../../Common/Date/ODataDate';
import validateData from '../../Validation/ValidatePhysicalInventoryCount';
import postSerial from './PhysicalInventoryDocItemSerialPost';
import Logger from '../../../Log/Logger';
import AnalyticsManager from '../../../AnalyticsManager/AnalyticsManagerLibrary';

/**
 *
 * @param {*} context
 * @param {*} done - Did user press done button, or next button?
 * @returns
 */
export default function PhysicalInventoryDocItemUpdatePost(context, done = true) {

    let binding = context.binding;
    let itemsMap = libCom.getStateVariable(context, 'PIDocumentItemsMap');

    //Used for transactionID in action. ItemCounted is necessary to batch things by counted and uncounted items.
    //The header flag UpdsateCountFlag will be set to 'X' for items that were previously counted and posted to backend
    let counted = binding.ItemCounted;
    if (!counted) {
        counted = '';
    }

    const pageProxy = context.getPageProxy();
    binding.TempHeader_Key = binding.PhysInvDoc + binding.FiscalYear + counted;
    binding.Temp_PIItemReadlink = itemsMap.getItem(0)['@odata.readLink'];
    binding.Temp_EntryQuantity = libCom.getControlProxy(pageProxy, 'QuantitySimple').getValue();
    binding.Temp_ZeroCount = libCom.getControlProxy(pageProxy, 'ZeroCountSwitch').getValue() === true ? 'X' : '';
    binding.Temp_Batch = binding.Batch;
    binding.Temp_Item = binding.Item;
    binding.Temp_Material = binding.Material;
    binding.Temp_EntryUOM = binding.EntryUOM;

    return validateData(context).then(valid => {
        if (valid) {
            binding.Temp_PIHeaderReadlink = libCom.getStateVariable(context, 'PIHeaderReadlink');
            binding.Temp_CountDate = new ODataDate().toLocalDateString();
            binding.Temp_FiscalYear = binding.FiscalYear;
            binding.Temp_PhysInvDoc = binding.PhysInvDoc;
            binding.Temp_UpdateCountFlag = counted; //Set header update flag to the counted status of the line item
            if (!binding['@sap.isLocal']) { //Don't update header if updating a local item
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocHeaderUpdateCount.action').then(() => {
                    return updateItem(context.getPageProxy(), itemsMap, done).then(() => {
                        AnalyticsManager.inventoryCountSuccess();
                    });
                });
            } else {
                return updateItem(context.getPageProxy(), itemsMap, done).then(() => {
                    AnalyticsManager.inventoryCountSuccess();
                });
            }
        }
        return false; //Validation failed
    });
}

/**
 * save the current line item and process the next in the itemsMap
 * @param {*} context
 * @returns
 */
function updateItem(context, itemsMap, done) {
    libCom.setStateVariable(context, 'RedrawPIItems', true);
    libCom.setStateVariable(context, 'RedrawPIItemsCounted', true);
    //Update the item count
    return PostItemUpdate(context).then(() => {
        //Remove serial state variables after they have been processed
        libCom.removeStateVariable(context, 'OldSerialRows');
        libCom.removeStateVariable(context, 'NewSerialMap');
        let updatedItemsCount = libCom.getStateVariable(context, 'BulkUpdateItem');
        if (updatedItemsCount !== undefined) {
            libCom.setStateVariable(context, 'BulkUpdateItem', updatedItemsCount + 1);
        }
        if (!done) { //User hit next button
            itemsMap.shift();
            if (itemsMap.length) {
                let selectList = '*,MaterialSLoc_Nav/StorageBin,MaterialPlant_Nav/SerialNumberProfile,Material_Nav/Description';
                let expand = 'MaterialPlant_Nav,MaterialSLoc_Nav,Material_Nav,PhysicalInventoryDocHeader_Nav';
                let readLink = itemsMap.getItem(0)['@odata.readLink'];
                let query = '$select=' + selectList + '&$expand=' + expand;

                return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], query).then(function(results) {
                    context.setActionBinding(results.getItem(0));
                    let page = context.getPageDefinition('/SAPAssetManager/Pages/Inventory/PhysicalInventory/PhysicalInventoryCountUpdate.page');
                    page._Name = itemsMap.getItem(0).Item;

                    return context.executeAction({ //Move to the next item in the list, using same open transaction screen
                        'Name': '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCountUpdateNav.action',
                        'Properties': {
                            'PageMetadata': page,
                            '_Type': 'Action.Type.Navigation',
                            'ModalPage': true,
                            'ClearHistory': true,
                            'PageToOpen': '/SAPAssetManager/Pages/Inventory/PhysicalInventory/Empty.page',
                            'NavigationType': 'Inner',
                        },
                    });
                });
            }
        }
        libCom.removeStateVariable(context, 'PIDocumentItemsMap');
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action').then(() => {
            if (libCom.getStateVariable(context, 'BulkUpdateItem') > 0) {
                return NavigateToPIDetailsPage(context); //Navigate to Details page after count all
            }
            return undefined;
        });
    });
}

function PostItemUpdate(context) {
    const isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal) {
       // Technical workaround - Delete and add item
       Logger.debug('Local PhysicalInventoryDocumentItem', 'Technical workaround for odata merge issue ' + isLocal);

       // Delete Item
       return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/LocalPhysicalInventoryDocItemDiscard.action').then( () => {
            // Add Item with updated values
            return context.executeAction({'Name':'/SAPAssetManager/Actions/Inventory/PhysicalInventory/LocalPhysicalInventoryItemCreateRelated.action', 'Properties': {
                'Properties': {
                    'PhysInvDoc' : context.binding.PhysInvDoc,
                    'FiscalYear': context.binding.FiscalYear,
                    'Item': context.binding.Item,
                    'Plant': context.binding.Plant,
                    'StorLocation': context.binding.StorLocation,
                    'StockType': context.binding.StockType,
                    'Material': context.binding.Material,
                    'Batch': context.binding.Batch,
                    'CountedBy': libCom.getSapUserName(context),
                    'CountDate': context.binding.CountDate,
                    'EntryQuantity': context.binding.Temp_EntryQuantity,
                    'EntryUOM': context.binding.EntryUOM,
                    'ZeroCount': context.binding.Temp_ZeroCount,
                    'Supplier': context.binding.Supplier,
                    'WBSElement': context.binding.WBSElement,
            }}})
            .then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/LocalPhysicalInventoryDocItemUpdateLinks.action');
            })
            .then(() => {
            return postSerial(context);
            });

       });
    }
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocItemUpdateCount.action').then(() => {
        return postSerial(context);
    });

}

export function NavigateToPIDetailsPage(context) {
    const PIHeader = libCom.getStateVariable(context, 'PIHeader');
    libCom.removeStateVariable(context, 'PIHeader');
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(PIHeader);
    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetailsNav.action');
}
