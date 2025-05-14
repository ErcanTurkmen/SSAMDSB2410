import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import validateData from '../Validation/ValidateIssueOrReceipt';
import onDemandObjectCreate from '../PurchaseOrder/PurchaseOrderOnDemandObjectDelete';
import SerialNumberLibrary from '../IssueOrReceipt/SerialNumberLibrary';
import IssueOrReceiptItemUpdate from './IssueOrReceiptItemUpdate';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import libLocal from '../../Common/Library/LocalizationLibrary';
import DocLib from '../../Documents/DocumentLibrary';
import itemsContextStateVariablesSet from '../MaterialDocument/ItemsContextStateVariablesSet';
import updateHeaderCountItems from '../InboundOrOutbound/UpdateHeaderCountItems';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
import GetMaterialUOM from '../Common/GetMaterialUOM';
import DecodeRequestedQuantity from './DecodeRequestedQuantity';
import createIssueorReceiptSignature from './IssueOrReceiptSignatureCreate';
import DocumentCreateBDS from '../../Documents/Create/DocumentCreateBDS';
import ShowMaterialNumberListPicker from '../Validation/ShowMaterialNumberListPicker';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';

export default function IssueOrReceiptCreateUpdatePost(context) {

    let binding = Object();
    //Binding specific fields
    let type = '';
    let item;
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (context.binding) {
        binding = context.binding;
    } else if (context.getActionBinding()) {
        binding = context.getActionBinding();
    }
    if (binding['@odata.type']) {
        type = binding['@odata.type'].substring('#sap_mobile.'.length);
    }

    //Material document header fields (some from screen)
    binding.TempHeader_DocumentDate = new ODataDate(libCom.getControlProxy(context, 'DocumentDate').getValue()).toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate(libCom.getControlProxy(context, 'DocumentDate').getValue()).toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate(libCom.getControlProxy(context, 'PostingDate').getValue()).toLocalDateString();
    binding.TempHeader_HeaderText = libCom.getControlProxy(context, 'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context, 'DeliveryNoteSimple').getValue();
    binding.TempHeader_BillOfLading = libCom.getControlProxy(context, 'BillOfLadingSimple').getValue();
    binding.TempHeader_UserName = libCom.getSapUserName(context);

    //Line item (fields from screen)
    binding.TempLine_MovementType = libCom.getListPickerValue(libCom.getControlProxy(context, 'MovementTypePicker').getValue());
    binding.TempLine_ItemText = libCom.getControlProxy(context, 'ItemTextSimple').getValue();
    binding.TempLine_UnloadingPoint = libCom.getControlProxy(context, 'UnloadingPointSimple').getValue();
    binding.TempLine_GLAccount = libCom.getListPickerValue(libCom.getControlProxy(context, 'GLAccountSimple').getValue());
    binding.TempLine_SpecialStockInd = libCom.getListPickerValue(libCom.getControlProxy(context, 'SpecialStockIndicatorPicker').getValue());
    binding.TempLine_Vendor = libCom.getListPickerValue(libCom.getControlProxy(context, 'VendorListPicker').getValue());
    binding.TempLine_SalesOrderNumber = libCom.getControlProxy(context, 'SalesOrderSimple').getValue();
    binding.TempLine_SalesOrderItem = libCom.getControlProxy(context, 'SalesOrderItemSimple').getValue();
    binding.TempLine_CostCenter = libCom.getListPickerValue(libCom.getControlProxy(context, 'CostCenterSimple').getValue());
    binding.TempLine_WBSElement = libCom.getControlProxy(context, 'WBSElementSimple').getValue();
    binding.TempLine_Order = libCom.getControlProxy(context, 'OrderSimple').getValue();
    binding.TempLine_Network = libCom.getControlProxy(context, 'NetworkSimple').getValue();
    binding.TempLine_Activity = libCom.getControlProxy(context, 'ActivitySimple').getValue();
    binding.TempLine_BusinessArea = libCom.getControlProxy(context, 'BusinessAreaSimple').getValue();
    binding.TempLine_StorageBin = libCom.getControlProxy(context, 'StorageBinSimple').getValue();
    binding.TempLine_GoodsReceipient = libCom.getControlProxy(context, 'GoodsRecipientSimple').getValue();
    binding.TempLine_Batch = libCom.getListPickerValue(libCom.getControlProxy(context, 'BatchListPicker').getValue());
    binding.TempLine_MovementReason = libCom.getListPickerValue(libCom.getControlProxy(context, 'MovementReasonPicker').getValue());
    binding.TempLine_ValuationType = libCom.getListPickerValue(libCom.getControlProxy(context, 'ValuationTypePicker').getValue());
    binding.TempLine_ValuationToType = libCom.getListPickerValue(libCom.getControlProxy(context, 'ValuationToPicker').getValue());
    const numOfLabels = libCom.getControlProxy(context, 'NumOfLabels').getValue();
    binding.TempLine_NumOfLabels = numOfLabels ? `${Number(numOfLabels)}` : '';
    binding.TempLine_EntryQuantity = libLocal.toNumber(context, libCom.getControlProxy(context, 'QuantitySimple').getValue());
    binding.TempLine_Material = binding.Material;
    let autoSerialNumberSwitch = libCom.getControlProxy(context, 'AutoSerialNumberSwitch').getValue();
    if (autoSerialNumberSwitch) {
        binding.TempLine_AutoGenerateSerialNumbers = 'X';
    } else {
        binding.TempLine_AutoGenerateSerialNumbers = '';
        binding.TempLine_SerialNumbers = [];
        const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual || (context.binding && context.binding.SerialNum) || [];
        if (serialNumbers.length) {
            for (let serialNumber of serialNumbers) {
                if (serialNumber.SerialNum) {
                    binding.TempLine_SerialNumbers.push(serialNumber.SerialNum);
                } else if (serialNumber.selected) {
                    binding.TempLine_SerialNumbers.push(serialNumber.SerialNumber);
                }
            }
        }
    }

    binding.TempLine_QuantityInBaseUOM = binding.TempLine_EntryQuantity;
    if (libCom.getControlProxy(context, 'DeliveryCompleteSwitch').getValue()) {
        binding.TempLine_DeliveryComplete = 'X';
    } else {
        binding.TempLine_DeliveryComplete = '';
    }
    binding.TempLine_StorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context, 'StorageLocationPicker').getValue());
    binding.TempLine_SpecialStockInd = libCom.getListPickerValue(libCom.getControlProxy(context, 'SpecialStockIndicatorPicker').getValue());
    binding.TempLine_StockType = libCom.getListPickerValue(libCom.getControlProxy(context, 'StockTypePicker').getValue());
    if (binding.TempLine_StockType === 'UNRESTRICTED') {
        binding.TempLine_StockType = ''; //Unrestricted has value of 'UNRESTRICTED' to accomodate picker, but needs to be set to '' for database
    }
    binding.TempLine_ValuationTypeTo = libCom.getListPickerValue(libCom.getControlProxy(context, 'ValuationToPicker').getValue());
    binding.TempLine_EntryUOM = libCom.getListPickerValue(libCom.getControlProxy(context, 'UOMSimple').getValue());
    //Find the item record we are receiving/issuing against
    if (type === 'MaterialDocItem') {
        if (ShowMaterialNumberListPicker(context)) {
            const materialReadLink = libCom.getListPickerValue(libCom.getControlProxy(context, 'MatrialListPicker').getValue());
            if (materialReadLink && materialReadLink.length > 0) {
                binding.TempLine_Material =  SplitReadLink(materialReadLink).MaterialNum;
            }   
        }      
        binding.TempLine_PurchaseOrderNumber = '';
        binding.TempLine_PurchaseOrderItem = '';
        binding.TempLine_ReservationNumber = '';
        binding.TempLine_ReservationItem = '';
        if (objectType === 'REV') {
            if (move === 'RET') {
                binding.TempHeader_GMCode = '01';
                binding.TempLine_MovementIndicator = 'B';
            } else if (move === 'REV') {
                if ([MovementTypes.t305, MovementTypes.t315].some(t => t === binding.TempLine_MovementType)) {
                    binding.TempHeader_GMCode = '04'; //2 step
                } else {
                    binding.TempHeader_GMCode = '06'; //Reversal
                }
                binding.TempLine_MovementIndicator = '';
            }
            if (move === 'EDIT') {
                binding.TempHeader_GMCode = binding.GMCode;
                binding.TempLine_MovementIndicator = binding.MovementIndicator;
                binding.TempLine_ReferenceDocHdr = binding.ReferenceDocHdr;
                binding.TempLine_ReferenceDocYear = binding.ReferenceDocYear;
                binding.TempLine_ReferenceDocItem = binding.ReferenceDocItem;
            } else {
                binding.TempLine_ReferenceDocHdr = binding.MaterialDocNumber;
                binding.TempLine_ReferenceDocYear = binding.MaterialDocYear;
                binding.TempLine_ReferenceDocItem = binding.MatDocItem;
            }
            binding.TempItem_ItemReadLink = binding['@odata.readLink'];
            binding.TempLine_Plant = binding.Plant;
            binding.TempLine_PurchaseOrderNumber = binding.PurchaseOrderNumber || '';
            binding.TempLine_PurchaseOrderItem = binding.PurchaseOrderItem || '';
            binding.TempLine_ReservationNumber = binding.ReservationNumber || '';
            binding.TempLine_ReservationItem = binding.ReservationItemNumber || '';
        } else if (binding.PurchaseOrderItem_Nav) {
            binding.TempItem_ItemReadLink = binding.PurchaseOrderItem_Nav['@odata.readLink'];
            binding.TempItem_OpenQuantity = Number(binding.PurchaseOrderItem_Nav.OpenQuantity);
            binding.TempItem_ReceivedQuantity = binding.PurchaseOrderItem_Nav.ReceivedQuantity;
        } else if (context.binding.StockTransportOrderItem_Nav) {
            binding.TempItem_ItemReadLink = binding.StockTransportOrderItem_Nav['@odata.readLink'];
            binding.TempItem_OrderQuantity = binding.StockTransportOrderItem_Nav.OrderQuantity;
            binding.TempItem_ReceivedQuantity = binding.StockTransportOrderItem_Nav.ReceivedQuantity;
            binding.TempItem_IssuedQuantity = binding.StockTransportOrderItem_Nav.IssuedQuantity;
            binding.TempItem_OpenQuantity = Number(binding.StockTransportOrderItem_Nav.OpenQuantity); //Not used for STO but variable is necessary
        } else if (context.binding.ReservationItem_Nav) {
            binding.TempItem_ItemReadLink = binding.ReservationItem_Nav['@odata.readLink'];
            binding.TempItem_OpenQuantity = Number(binding.ReservationItem_Nav.RequirementQuantity) - Number(binding.ReservationItem_Nav.WithdrawalQuantity);
            binding.TempItem_ReceivedQuantity = binding.ReservationItem_Nav.WithdrawalQuantity;
        } else if (objectType === 'PRD') {
            if (context.binding.ProductionOrderComponent_Nav) {
                binding.TempItem_ItemReadLink = binding.ProductionOrderComponent_Nav['@odata.readLink'];
                binding.TempItem_OpenQuantity = Number(binding.ProductionOrderComponent_Nav.RequirementQuantity);
                binding.TempItem_ReceivedQuantity = binding.ProductionOrderComponent_Nav.WithdrawalQuantity;
            }
            if (context.binding.ProductionOrderItem_Nav) {
                binding.TempItem_ItemReadLink = binding.ProductionOrderItem_Nav['@odata.readLink'];
                binding.TempItem_OpenQuantity = Number(binding.ProductionOrderItem_Nav.OrderQuantity);
                binding.TempItem_ReceivedQuantity = binding.ProductionOrderItem_Nav.ReceivedQuantity;
            }
        }         
        binding.TempHeader_GMCode = binding.TempHeader_GMCode || binding.AssociatedMaterialDoc?.GMCode;
        binding.TempLine_OldQuantity = binding.EntryQuantity;
        binding.TempLine_ToPlant = libCom.getListPickerValue(libCom.getControlProxy(context, 'PlantToListPicker').getValue());
        binding.TempLine_ToStorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context, 'StorageLocationToListPicker').getValue());
        binding.TempLine_ToBatch = libCom.getListPickerValue(libCom.getControlProxy(context, 'BatchNumToListPicker').getValue());
    } else if (type === 'PurchaseOrderItem') {
        binding.TempLine_OldQuantity = 0; //We don't have an old quantity becuase this isn't a material doc item
        item = binding;
        binding.TempLine_PurchaseOrderNumber = item.PurchaseOrderId;
        binding.TempLine_PurchaseOrderItem = item.ItemNum;
        binding.TempLine_Plant = item.Plant;
        binding.TempHeader_GMCode = '01'; //Goods receipt
        binding.TempLine_MovementIndicator = 'B'; //Receipt
        //Item values to update the PurchaseOrderItem reflecting this receipt
        binding.TempItem_OpenQuantity = item.OpenQuantity;
        binding.TempItem_ReceivedQuantity = item.ReceivedQuantity;
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = binding.MaterialNum;
    } else if (type === 'ProductionOrderItem') {
        binding.TempLine_OldQuantity = 0;
        item = binding;
        binding.TempLine_PurchaseOrderNumber = '';
        binding.TempLine_PurchaseOrderItem = '';
        binding.TempLine_PRDOrderNumber = item.OrderId;
        binding.TempLine_PRDOrderItem = item.ItemNum;
        binding.TempLine_Plant = item.PlanningPlant;
        binding.TempHeader_GMCode = '02'; //Goods receipt for PRD item
        binding.TempLine_MovementIndicator = 'F'; //Receipt for PRD item
        binding.TempItem_OpenQuantity = Number(item.OrderQuantity) - Number(item.ReceivedQuantity);
        binding.TempItem_ReceivedQuantity = item.ReceivedQuantity;
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = item.MaterialNum;
    } else if (type === 'StockTransportOrderItem') {
        binding.TempLine_OldQuantity = 0;
        item = binding;
        binding.TempLine_PurchaseOrderNumber = item.StockTransportOrderId;
        binding.TempLine_PurchaseOrderItem = item.ItemNum;
        if (allowIssue(item)) { //Issue so use supply plant
            binding.TempLine_Plant = item.StockTransportOrderHeader_Nav.SupplyingPlant;
        } else {
            binding.TempLine_Plant = item.Plant;
        }
        //Item values to update the STO reflecting this receipt
        binding.TempItem_OrderQuantity = item.OrderQuantity;
        binding.TempItem_OpenQuantity = item.OpenQuantity;
        binding.TempItem_ReceivedQuantity = item.ReceivedQuantity;
        binding.TempItem_IssuedQuantity = item.IssuedQuantity;
        if (move === 'I') { //Issue
            binding.TempHeader_GMCode = '04';
            binding.TempLine_MovementIndicator = '';
        } else { //Receipt
            binding.TempHeader_GMCode = '01';
            binding.TempLine_MovementIndicator = 'B';
        }
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = item.MaterialNum;
    } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
        binding.TempLine_OldQuantity = 0;
        item = binding;
        binding.TempLine_ReservationNumber = item.ReservationNum || item.Reservation;
        binding.TempLine_ReservationItem = item.ItemNum;
        binding.TempLine_Plant = item.SupplyPlant;
        binding.TempLine_RecordType = item.RecordType;
        //Item values to update the reservationItem reflecting this issue
        binding.TempItem_OpenQuantity = Number(item.RequirementQuantity) - Number(item.WithdrawalQuantity);
        binding.TempItem_ReceivedQuantity = item.WithdrawalQuantity;
        binding.TempHeader_GMCode = '03'; //Goods issue
        binding.TempLine_MovementIndicator = ''; //Issue
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = item.MaterialNum;
    } else if (type === 'MaterialSLoc') {
        binding.TempLine_EntryUOM = binding.Material.BaseUOM;
        binding.TempLine_Plant = binding.Plant;
        binding.TempLine_Material = binding.MaterialNum;
        if (move === 'I') { //Issue
            if (objectType === 'TRF') {
                binding.TempHeader_GMCode = '04';
                binding.TempLine_ToPlant = libCom.getListPickerValue(libCom.getControlProxy(context, 'PlantToListPicker').getValue());
                binding.TempLine_ToStorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context, 'StorageLocationToListPicker').getValue());
                binding.TempLine_ToBatch = libCom.getListPickerValue(libCom.getControlProxy(context, 'BatchNumToListPicker').getValue());
                binding.TempLine_MovementIndicator = ''; //Transfer
            } else {
                binding.TempHeader_GMCode = '03'; //Goods issue
                binding.TempLine_MovementIndicator = ''; //Issue
            }
        } else if (move === 'R') { //Receipt
            binding.TempHeader_GMCode = '05'; //Goods receipt
            binding.TempLine_MovementIndicator = ''; //Receipt
        }
    } else {
        let materialReadLink = libCom.getListPickerValue(libCom.getControlProxy(context, 'MatrialListPicker').getValue());
        let material = '';
        let plant = '';
        if (materialReadLink && materialReadLink.length > 0) {
            material = SplitReadLink(materialReadLink).MaterialNum;
            plant = SplitReadLink(materialReadLink).Plant;
        }
        binding.TempLine_Material = material;
        binding.TempLine_Plant = plant;
        if (move === 'I' || move === 'T') { //Issue
            if (objectType === 'TRF' || move === 'T') {
                binding.TempHeader_GMCode = '04';
                binding.TempLine_ToPlant = libCom.getListPickerValue(libCom.getControlProxy(context, 'PlantToListPicker').getValue());
                binding.TempLine_ToStorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context, 'StorageLocationToListPicker').getValue());
                binding.TempLine_ToBatch = libCom.getListPickerValue(libCom.getControlProxy(context, 'BatchNumToListPicker').getValue());
            } else {
                binding.TempHeader_GMCode = '03';
            }
            binding.TempLine_MovementIndicator = ''; //Issue
        } else if (move === 'R') { //Receipt
            binding.TempHeader_GMCode = '05'; //Goods receipt
            binding.TempLine_MovementIndicator = ''; //Receipt
        }
        binding.TempLine_PurchaseOrderNumber = '';
        binding.TempLine_PurchaseOrderItem = '';
        binding.TempLine_ReservationNumber = '';
        binding.TempLine_ReservationItem = '';
        [binding.TempLine_ConfirmedQuantity] = DecodeRequestedQuantity(libCom.getControlProxy(context, 'RequestedQuantitySimple').getValue());
    }

    return GetMaterialUOM(context, binding.TempLine_Material, binding.TempLine_EntryUOM)
        .then(TempLine_MaterialUOM => {
            if (TempLine_MaterialUOM) {
                binding.TempLine_BaseUOM = TempLine_MaterialUOM.BaseUOM;
                if (TempLine_MaterialUOM.BaseUOM !== binding.TempLine_EntryUOM) {
                    binding.TempLine_QuantityInBaseUOM = binding.TempLine_EntryQuantity * TempLine_MaterialUOM.ConversionFactor;
                    if (binding.TempLine_OldQuantity > 0 && TempLine_MaterialUOM.BaseUOM !== binding.EntryUOM) {
                        binding.TempLine_OldQuantity = binding.TempLine_OldQuantity * TempLine_MaterialUOM.ConversionFactor;
                    }
                } else if (binding.TempLine_OldQuantity && binding.TempLine_EntryUOM !== binding.EntryUOM && TempLine_MaterialUOM.BaseUOM !== binding.EntryUOM) {
                    return GetMaterialUOM(context, binding.TempLine_Material, binding.EntryUOM)
                        .then(TempLine_OldMaterialUOM => {
                            if (TempLine_OldMaterialUOM?.ConversionFactor) {
                                binding.TempLine_OldQuantity = binding.TempLine_OldQuantity * TempLine_OldMaterialUOM.ConversionFactor;
                            }
                            return IssueOrReceipt(context, binding, objectType, move, type);
                        });
                }
            }
            return IssueOrReceipt(context, binding, objectType, move, type);
        });
}

// setting params for the item list modal window
// also adding doc id to state variable, if setId is true
export async function setStateFromContext(context, objectType, setId = false) {
    if (checkAdhocReceiptAbility(objectType)) {
        libCom.removeStateVariable(context, 'MaterialPlantValue');
        libCom.removeStateVariable(context, 'MaterialSLocValue');
        libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
        let docInfo = context.getActionBinding();
        if (docInfo) {
            if (setId) {
                libCom.setStateVariable(context, 'ActualDocId', docInfo.TempHeader_Key);
                let fixedData = {
                    headerNote: docInfo.TempHeader_HeaderText,
                    postingDate: docInfo.TempHeader_PostingDate,
                    order: docInfo.TempLine_Order,
                    salesorder: docInfo.TempLine_SalesOrderNumber,
                    network: docInfo.TempLine_Network,
                    cost_center: docInfo.TempLine_CostCenter,
                    project: docInfo.TempLine_WBSElement,
                };
                libCom.setStateVariable(context, 'FixedData', fixedData);
            }
            let params = {
                MovementType: docInfo.TempLine_MovementType,
                StorageLocation: docInfo.TempLine_StorageLocation,
                Plant: docInfo.TempLine_Plant,
                OrderNumber: docInfo.TempLine_Order,
            };
            return itemsContextStateVariablesSet(context, docInfo.TempHeader_Key, params);
        }

    }
    return Promise.resolve();
}

// check for ability to add multiple params (enable ability)
export function checkAdhocReceiptAbility(objectType) {
    return (objectType === 'ADHOC');
}

function IssueOrReceipt(context, binding, objectType, move, type) {
    return validateData(context, binding).then(valid => {
        if (!valid) {
            return false; //Validation failed
        }
        binding.IsMatDocCreate = true;
        //We already have a local material document for this inventory object, so keep adding to it
        if (!(objectType === 'REV' && move !== 'EDIT')) {
            if (libCom.getStateVariable(context, 'Temp_MaterialDocumentReadLink')) {
                binding.TempHeader_MatDocReadLink = libCom.getStateVariable(context, 'Temp_MaterialDocumentReadLink');
                binding.TempHeader_Key = libCom.getStateVariable(context, 'Temp_MaterialDocumentNumber');
                binding.IsMatDocCreate = false;
                //Update the existing material document item
                if (type === 'MaterialDocItem') {
                    binding.TempLine_MatDocItemReadLink = binding['@odata.readLink'];
                    binding.TempItem_Key = binding.MatDocItem;
                    //Need this variable because after action on line 239 we lost binding.SerialNum
                    const serialNum = binding.SerialNum;

                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentUpdate.action')//Update the material document header
                        .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemUpdate.action'))//Update the material document item
                        .then(() => {
                            binding.SerialNum = serialNum;
                            return SerialNumberLibrary.updateItemSerialNumber(context);
                        })
                        .then(() => {
                            if (!libCom.getStateVariable(context, 'MaterialDocumentBulkUpdate')) {
                                return IssueOrReceiptItemUpdate(context);
                            } else {
                                return Promise.resolve();
                            }
                        })//Update the PO/STO/RES item counts
                        .then(() => {
                            libCom.setStateVariable(context, 'IMEntity', 'MaterialDocument');
                            if (libCom.IsOnCreate(context)) {
                                //clear oncreate
                                libCom.clearStateVariable(context, 'TransactionType');
                            }
                           return DocumentCreateBDS(context);
                        })
                        .then(() => createIssueorReceiptSignature(context))
                        .then(() => {
                            if (libCom.getStateVariable(context, 'MaterialDocumentBulkUpdate')) {
                                return navigateToBulkIssueOrReceipt(context).then(() => {
                                    if (move === 'I') {
                                        AnalyticsManager.goodsIssueSuccess();
                                    } else if (move === 'R') {
                                        AnalyticsManager.goodsReceiptSuccess();
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action').then(() => {
                                    if (move === 'I') {
                                        AnalyticsManager.goodsIssueSuccess();
                                    } else if (move === 'R') {
                                        AnalyticsManager.goodsReceiptSuccess();
                                    } else {
                                        return;
                                    }
                                });
                            }
                        });//Close screen and show success popup
                }
                if (checkAdhocReceiptAbility(objectType)) {
                    // this would work only when we're adding multiple items to single document
                    if (!context.binding) {
                        context.setActionBinding(binding);
                    }
                    //Create related material document item
                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreateRelated.action')
                        .then(() => IssueOrReceiptItemUpdate(context)) //Update the PO Item counts
                        .then(() => SerialNumberLibrary.createItemSerialNumber(context))//Create material document item serial numbers
                        .then(() => setStateFromContext(context, objectType))// update info in local variables to show data in the item list page
                        .then(() => {
                            if (type === 'DUMMY') { //This will never happen, used to fool metadata linter for now
                                return onDemandObjectCreate(context);
                            }
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentRedirectToListClose.action').then(() => {
                                if (move === 'I') {
                                    AnalyticsManager.goodsIssueSuccess();
                                } else if (move === 'R') {
                                    AnalyticsManager.goodsReceiptSuccess();
                                } else {
                                    return;
                                }
                            });
                        });
                }
                //Starting from PO/STO/RES item, so update the material document header, then create new item
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentUpdate.action')
                .then(response =>
                    libCom.setStateVariable(context, 'CreateMaterialDocument', JSON.parse(response.data)))
                    .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreateRelated.action'))//Create the material document item
                    .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemUpdateLinks.action'))//Update the read links on the new material document item
                    .then(() => SerialNumberLibrary.createItemSerialNumber(context))//Create material document item serial numbers
                    .then(() => IssueOrReceiptItemUpdate(context))//Update the PO/STO/RES ttem counts
                    .then(() => {
                        libCom.setStateVariable(context, 'IMEntity', 'MaterialDocument');
                        _createDocuments(context);
                    })
                    .then(() => updateHeaderCountItems(context))
                    .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action')).then(() => {
                        if (move === 'I') {
                            AnalyticsManager.goodsIssueSuccess();
                        } else if (move === 'R') {
                            AnalyticsManager.goodsReceiptSuccess();
                        } else {
                            return;
                        }
                    });//Close screen and show success popup
            }
        }
        //SET VARIABLES
        _createDocuments(context);

        if (!context.binding) {
            context.setActionBinding(binding);
        }
        //No existing material document for this PO, so create the material document header and item
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentCreate.action')
        .then(response => {
            libCom.setStateVariable(context, 'CreateMaterialDocument', JSON.parse(response.data));
            libCom.setStateVariable(context, 'IMEntity', 'MaterialDocument');
            libCom.setStateVariable(context, 'lastLocalmaterialDocYear', JSON.parse(response.data).MaterialDocYear);
            libCom.setStateVariable(context, 'lastLocalmaterialDocNumber', JSON.parse(response.data).MaterialDocNumber);
            //Set the global TransactionType variable to CREATE
            libCom.setOnCreateUpdateFlag(context, 'CREATE');
        })    
            .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreate.action'))//Create the material document item
            .then(() => IssueOrReceiptItemUpdate(context))//Update the PO Item counts
            .then(() => SerialNumberLibrary.createItemSerialNumber(context))//Create material document item serial numbers
            .then(() =>
                //Create or update the on demand object record to refresh the PO from backend
                //return onDemandObjectCreate(context).then(() => {
                // update info in local variables to show data in the item list page
                // also adding local doc id to state variable too, for future actions
                setStateFromContext(context, objectType, true))
            .then(() => {
                if (type === 'DUMMY') { //This will never happen, used to fool metadata linter for now
                    return onDemandObjectCreate(context);
                }
                //Close screen and show success popup
                if (checkAdhocReceiptAbility(objectType)) {
                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentRedirectToListClose.action').then(() => {
                        if (move === 'I') {
                            AnalyticsManager.goodsIssueSuccess();
                        } else if (move === 'R') {
                            AnalyticsManager.goodsReceiptSuccess();
                        } else {
                            return;
                        }
                    });
                }
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action').then(() => {
                    if (move === 'I') {
                        AnalyticsManager.goodsIssueSuccess();
                    } else if (move === 'R') {
                        AnalyticsManager.goodsReceiptSuccess();
                    } else {
                        return;
                    }
                });
            });
    });
}


export function _createDocuments(context) {
    // attachments
    const attachmentDescription = context.getPageProxy().getControl('FormCellContainer').getControl('AttachmentDescription').getValue() || '';
    const attachments = context.getPageProxy().getControl('FormCellContainer').getControl('Attachment').getValue();
    const signature = context.getPageProxy().getControl('FormCellContainer').getControl('SignatureCaptureFormCell').getValue();
    const signatureUser = context.getPageProxy().getControl('FormCellContainer').getControl('Signatory').getValue();
    if (signature) {
        const signatureContentType = context.getPageProxy().getControl('FormCellContainer').getControl('SignatureCaptureFormCell').getValue().contentType;
        libCom.setStateVariable(context, 'signatureContentType', signatureContentType);
    }
    libCom.setStateVariable(context, 'DocDescription', attachmentDescription);
    libCom.setStateVariable(context, 'Doc', attachments);
    libCom.setStateVariable(context, 'signature', signature);
    libCom.setStateVariable(context, 'signatureUser', signatureUser);
    libCom.setStateVariable(context, 'Class', 'MaterialDocument');
    libCom.setStateVariable(context, 'ObjectKey', 'MaterialDocNumber');
    libCom.setStateVariable(context, 'entitySet', 'MatDocAttachments');
    libCom.setStateVariable(context, 'parentEntitySet', 'MaterialDocuments');
    libCom.setStateVariable(context, 'parentProperty', 'MaterialDocument_Nav');
    libCom.setStateVariable(context, 'attachmentCount', DocLib.validationAttachmentCount(context));

    return Promise.resolve();
}

function navigateToBulkIssueOrReceipt(context) {
    const binding = context.binding;
    let readLink;
    if (binding.ReservationItem_Nav) {
        readLink = binding.ReservationItem_Nav.ReservationHeader_Nav['@odata.readLink'];
    } else if (binding.PurchaseOrderItem_Nav) {
        readLink = binding.PurchaseOrderItem_Nav.PurchaseOrderHeader_Nav['@odata.readLink'];
    } else if (binding.StockTransportOrderItem_Nav) {
        readLink = binding.StockTransportOrderItem_Nav.StockTransportOrderHeader_Nav['@odata.readLink'];
    } else if (binding.ProductionOrderComponent_Nav) {
        readLink = binding.ProductionOrderComponent_Nav.ProductionOrderHeader_Nav['@odata.readLink'];
    }
    if (readLink) {
        return libCom.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptNav.action', readLink);
    }
    return undefined;
}
