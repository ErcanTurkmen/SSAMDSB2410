import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import updateHeaderStatus from '../InboundOrOutbound/InboundOrOutboundUpdateHeaderStatus';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import GetValuationType from '../IssueOrReceipt/Valuations/GetValuationType';
import { InventoryOrderTypes } from '../Common/Library/InventoryLibrary';

export default function InboundOrOutboundDeliveryUpdateWithItems(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    const isIBD = type === InventoryOrderTypes.IB;
    // Convenience Declarations
    const DeliveriesEntitySet = (isIBD ? 'InboundDeliveries' : 'OutboundDeliveries');
    const DeliveryItemsEntitySet = (isIBD ? 'InboundDeliveryItems' : 'OutboundDeliveryItems');
    const expand = (isIBD ? 'InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav&$orderby=Item' : 'OutboundDelivery_Nav,OutboundDeliverySerial_Nav,MaterialPlant_Nav&$orderby=Item');
    const DocumentCategory = (isIBD ? '7' : 'J');
    const DeliveryItem_Nav = (isIBD ? 'InboundDeliveryItem_Nav' : 'OutboundDeliveryItem_Nav');
    const DeliverySerialsEntitySet = (isIBD ? 'InboundDeliverySerials' : 'OutboundDeliverySerials');
    
    return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
        'Target': {
            'EntitySet': DeliveriesEntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'ReadLink': context.binding['@odata.readLink'],
        },
        'Properties': {
            'ActualGoodsMvtDate': new ODataDate().toDBDateTimeString(context),
            'DocumentCategory' : DocumentCategory,
            'GoodsMvtStatus': 'C',
        },
        'Headers': {
            'OfflineOData.TransactionID': context.binding.DeliveryNum,
        },
    }}).then(() => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', DeliveryItemsEntitySet, [], `$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$expand=${expand}`).then(async function(results) {
            let itemsPromises = [];
            if (results && results.length > 0) {
                itemsPromises = await updateDeliveryItems(results, context, DeliveryItemsEntitySet, DeliverySerialsEntitySet, DeliveryItem_Nav);
            }
            return Promise.all(itemsPromises).then(() => {
                return updateHeaderStatus(context, context.binding.DeliveryNum);
            });
        });
    }).then(() => {
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessMessage.action').then(() => {
            if (libCom.getPageName(context) === 'InboundOutboundListPage') {
                libCom.setStateVariable(context, 'BulkUpdateItem', 1);
                return navigateToInboundOutboundDetailsPage(context);       
            }
            return undefined;   
        });
    });
}

async function updateDeliveryItems(results, context, DeliveryItemsEntitySet, DeliverySerialsEntitySet, DeliveryItem_Nav) {
    let itemsPromises = [];
    for (let index = 0; index < results.length; index++) {
        let itemBinding = results.getItem(index);
        if (!Object.prototype.hasOwnProperty.call(itemBinding,'@sap.isLocal') && Number(itemBinding.PickedQuantity) === 0) {
            let props = await getItemProperties(context, itemBinding);

            // Update Delivery Item
            itemsPromises.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
                'Target': {
                    'EntitySet': DeliveryItemsEntitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': itemBinding['@odata.readLink'],
                },
                'Properties': props,
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                },
                'Headers': {
                    'OfflineOData.TransactionID': context.binding.DeliveryNum,
                },
            }}));

            const serialNumbers = itemBinding.InboundDeliverySerial_Nav || itemBinding.OutboundDeliverySerial_Nav;
            if (serialNumbers.length > 0) {
                // Accept Existing Serial Numbers
                for (const serialNumber of serialNumbers) {
                    itemsPromises.push(context.executeAction({
                        'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
                            'Target': {
                                'EntitySet': DeliverySerialsEntitySet,
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': serialNumber['@odata.readLink'],
                            },
                            'Properties': {
                                'IsDownloaded': '',
                                'Item': serialNumber.Item,
                                'SerialNumber': serialNumber.SerialNumber,
                                'DeliveryNum': serialNumber.DeliveryNum,
                            },
                            'RequestOptions': {
                                'UpdateMode': 'Replace',
                            },
                            'UpdateLinks': [{
                                'Property': DeliveryItem_Nav,
                                'Target':
                                {
                                    'EntitySet': DeliveryItemsEntitySet,
                                    'ReadLink': itemBinding['@odata.readLink'],
                                },
                            }],
                            'Headers': {
                                'OfflineOData.TransactionID': context.binding.DeliveryNum,
                            },
                        },
                    }));
                }
            }
        }
    }
    return itemsPromises;
}

function navigateToInboundOutboundDetailsPage(context) {
    const type = libCom.getStateVariable(context, 'IMObjectType');
    const navAction = (type === 'IB') ? '/SAPAssetManager/Actions/Inventory/Inbound/InboundDeliveryDetailNav.action' : '/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action';
    context.getPageProxy().setActionBinding(context.getPageProxy().getActionBinding());
    return context.executeAction(navAction);
}

async function getItemProperties(context, itemBinding) {
    let props = {
        'Plant': itemBinding.Plant,
        'StorageLocation': itemBinding.StorageLocation,
        'PickedQuantity': itemBinding.Quantity,
        'UOM': itemBinding.UOM,
        'Batch': itemBinding.Batch,
        'StorageBin': itemBinding.StorageBin,
        'ValuationType': await GetValuationType(context, itemBinding),
    };
    return props;
}
