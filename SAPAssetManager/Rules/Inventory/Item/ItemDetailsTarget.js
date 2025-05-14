import GetStorageBin from '../Validation/GetStorageBin';
import GetPurchaseOrderItemsOpenQuantitiesText from '../PurchaseOrder/GetPurchaseOrderItemsOpenQuantitiesText';
import GetMaterialName from '../Common/GetMaterialName';
import InboundOutboundDeliveryQuantity from '../InboundOrOutbound/InboundOutboundDeliveryQuantity';
import GetMaterialDesc from './GetMaterialDesc';
import GetValuationType from '../IssueOrReceipt/Valuations/GetValuationType';
import purchaseRequisitionDateCaption from '../PurchaseRequisition/PurchaseRequisitionDateCaption';
import libCom from '../../Common/Library/CommonLibrary';
import purchaseRequisitionItemLongText from '../PurchaseRequisition/PurchaseRequisitionItemLongText';
import getPIStockType from '../PhysicalInventory/GetStockType';
import GetAddress from './GetAddress';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
import PurchaseOrderItemLongText from '../PurchaseOrder/PurchaseOrderItemLongText';
import STOItemLongText from '../StockTransportOrder/STOItemLongText';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default async function ItemDetailsTarget(context) {
    /** @type {PurchaseOrderItem & PurchaseRequisitionItem & StockTransportOrderItem & ReservationItem & ProductionOrderItem & ProductionOrderComponent & InboundDeliveryItem & OutboundDeliveryItem & MaterialDocItem & PhysicalInventoryDocItem } */
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    const type = item['@odata.type'].substring('#sap_mobile.'.length);

    const commonFields = {
        PLantSLoc: getPlantSLoc(item.Plant, item.StorageLoc),
        Material: item.Material || item.MaterialNum,
        MaterialDesc: item.ItemText,
        StockType: context.localizeText(getStockType(item.StockType)),
    };

    const propertyRenameStrategy = {
        PurchaseOrderItem: PurchaseOrderItemProps,
        PurchaseRequisitionItem: PurchaseRequisitionItemProps,
        PhysicalInventoryDocItem: PhysicalInventoryDocItemProps,
        StockTransportOrderItem: StockTransportOrderItemProps,
        InboundDeliveryItem: InboundDeliveryItemOutboundDeliveryItemProps,
        OutboundDeliveryItem: InboundDeliveryItemOutboundDeliveryItemProps,
        ProductionOrderItem: ProductionOrderItemProps,
        ProductionOrderComponent: ProductionOrderComponentProps,
        ReservationItem: ReservationItemProps,
        MaterialDocItem: MaterialDocItemProps,
    }[type];

    return Promise.resolve((propertyRenameStrategy && propertyRenameStrategy(context, item)) || {})
        .then(objWithExtraProps => ({ ...item, ...commonFields, ...objWithExtraProps }))
        .then(obj => MaterialPlantProps(context, item, type)
            .then(plantProps => ({ ...obj, ...plantProps })))
        .then(obj => ValidationLibrary.evalIsEmpty(item.PurchaseRequisitionAddress_Nav) ?
            obj : AddressProps(context, item.PurchaseRequisitionAddress_Nav.AddressNumber).then(address => ({ ...address, ...obj })));
}

function getStockType(stockType) {
    return {
        'S': 'stock_type_options_blocked',
        'X': 'stock_type_options_inspection',
    }[stockType] || 'stock_type_options_unrestricted';
}

function getPlantSLoc(plant, sloc) {
    return plant && sloc ? `${plant}/${sloc}` : (plant || sloc || '');
}

/** @param {MaterialPlant} item  */
function MaterialPlantProps(context, item, type) {
    const plantId = item.Plant || item.SupplyPlant || (item.StockTransportOrderHeader_Nav && item.StockTransportOrderHeader_Nav.SupplyingPlant) || item.PlanningPlant || '-1';
    const material = item.Material || item.MaterialNum || '-1';
    const query = `$filter=Plant eq '${plantId}' and MaterialNum eq '${material}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query)
        .then(async (data) => {
            if (data.length !== 1) {
                return {};
            }
            /** @type {MaterialPlant} */
            const plant = data.getItem(0);
            const materialPlantProps = { ValuationType: item.ValuationType };
            if (plant.ValuationCategory && !plant.BatchIndicator && type === 'ReservationItem') {
                materialPlantProps.ValuationType = item.Batch;
                materialPlantProps.Batch = '';
            }
            if (!materialPlantProps.ValuationType && plant.ValuationCategory && item) {
                materialPlantProps.ValuationType = await GetValuationType(context, item);
            }
            return materialPlantProps;
        });
}

function AddressProps(context, AddressNumber) {
    return GetAddress(context, AddressNumber).then((/** @type {Address} */ address) => {
        return address ? {
            Country: address.Country,
            Region: address.Region,
            Street: address.Street,
            PostalCodeCity: `${address.PostalCode}/${address.City}`,
            HouseNum: address.HouseNum,
        } : {};
    });
}

async function PurchaseOrderItemProps(context, item) {
    return {
        QuantityUOM: GetPurchaseOrderItemsOpenQuantitiesText(context, item, true),
        StorageBin: GetStorageBin(context, item),
        Batch: item.ScheduleLine_Nav[0] && item.ScheduleLine_Nav[0].Batch,
        Vendor: item.PurchaseOrderHeader_Nav.Vendor,
        LongText: await PurchaseOrderItemLongText(context, item),
        OverDeliveryTolerance:(item.OverDeliveryTol === item.OrderQuantity) ? 0 : item.OverDeliveryTol,
        UnderDeliveryTolerance:(item.UnderDeliveryTol === item.OrderQuantity) ? 0 : item.UnderDeliveryTol,
    };
}

/** @param {PurchaseRequisitionItem} item  */
function PurchaseRequisitionItemProps(context, item) {
    return {
        PRGroupOrg: getPlantSLoc(item.PurchaseOrg, item.PurchaseGroup),
        DeliveryDate: purchaseRequisitionDateCaption(context, item.DeliveryDate),
        QuantityUOM: item.ItemQuantity + ' ' + item.BaseUOM,
        PriceDetails: item.ValuationPrice + '/' + item.ValuationPriceUnit + item.Currency,
        PlantName: libCom.getPlantName(context, item.Plant),
        SlocName: libCom.getStorageLocationName(context, item.Plant, item.StorageLocation),
        StorageBin: GetStorageBin(context, item),
        LongText: purchaseRequisitionItemLongText(context, item),
    };
}

/** @param {PhysicalInventoryDocItem} item  */
async function PhysicalInventoryDocItemProps(context, item) {
    return {
        StockType: getPIStockType(context, item),
        ItemNum: item.Item,
        QuantityUOM: item.EntryQuantity + ' ' + (item.EntryUOM ? item.EntryUOM : item.BaseUOM),
        StorageBin: item.MaterialSLoc_Nav.StorageBin,
        ZeroCount: item.ZeroCount ? context.localizeText('yes') : context.localizeText('no'),
        Serialized: item.MaterialPlant_Nav && item.MaterialPlant_Nav.SerialNumberProfile ? context.localizeText('yes') : context.localizeText('no'),
        Deleted : item.Deleted ? context.localizeText('yes') : context.localizeText('no'),
    };
}

async function StockTransportOrderItemProps(context, item) {
    return {
        Batch: item.STOScheduleLine_Nav[0] && item.STOScheduleLine_Nav[0].Batch,
        SupplyPlant: item.StockTransportOrderHeader_Nav.SupplyingPlant,
        QuantityUOM: GetPurchaseOrderItemsOpenQuantitiesText(context, item, true),
        StorageBin: GetStorageBin(context, item),
        LongText: await STOItemLongText(context, item),
    };
}

/** @param {InboundDeliveryItem | OutboundDeliveryItem} item  */
async function InboundDeliveryItemOutboundDeliveryItemProps(context, item) {
    return {
        ItemNum: item.Item,
        PLant: item.Plant,
        MaterialDesc: await GetMaterialName(context, item),
        QuantityUOM: InboundOutboundDeliveryQuantity(context, item),
        StorageBin: GetStorageBin(context, item),
    };
}

/** @param {ProductionOrderItem} item  */
function ProductionOrderItemProps(context, item) {
    return {
        PLantSLoc: getPlantSLoc(item.PlanningPlant, ''),
        MaterialDesc: item.Material_Nav.Description,
        Material: item.MaterialNum,
        QuantityUOM: item.OrderQuantity + ' ' + item.OrderUOM,
        StorageBin: GetStorageBin(context, item),
        OrderType: item.ProductionOrderHeader_Nav.OrderType,
        DeliveryCompletionIndicator: context.localizeText(item.DeliveryCompletedFlag ? 'yes' : 'no'),
    };
}

/** @param {ProductionOrderComponent} item  */
async function ProductionOrderComponentProps(context, item) {
    return {
        PLantSLoc: getPlantSLoc(item.SupplyPlant, item.SupplyStorageLocation),
        Material: item.MaterialNum,
        GLAccount: '',
        MaterialDesc: await GetMaterialName(context, item),
        QuantityUOM: GetPurchaseOrderItemsOpenQuantitiesText(context, item, true),
        StorageBin: GetStorageBin(context, item),
    };
}

/** @param {ReservationItem} item  */
async function ReservationItemProps(context, item) {
    return {
        PLantSLoc: getPlantSLoc(item.SupplyPlant, item.SupplyStorageLocation),
        MaterialDesc: await GetMaterialName(context, item),
        QuantityUOM: GetPurchaseOrderItemsOpenQuantitiesText(context, item, true),
        OrderId: item.ReservationHeader_Nav.OrderId,
        CostCenter: item.ReservationHeader_Nav.CostCenter,
        NetworkActivity: item.ReservationHeader_Nav.Network,
        StorageBin: GetStorageBin(context, item),
    };
}

/** @param {MaterialDocItem} item  */
async function MaterialDocItemProps(context, item) {
    const propObj = {
        ItemNum: item.MatDocItem,
        PLantSLoc: getPlantSLoc(item.Plant, item.StorageLocation),
        MaterialDesc: GetMaterialDesc(context, item),
        QuantityUOM: item.EntryQuantity + ' ' + item.EntryUOM,
        NumOfLabels: item['@sap.isLocal'] ? item.NumOfLabels : '',
        SpecialStockIndicatorText: item.SpecialStockInd ? (await SpecialStockToListpickerItem(context, item.SpecialStockInd)) : '',
    };

    if (item.MovementType === MovementTypes.t101) {
        propObj.autoSerialNumbers = !!item.AutoGenerateSerialNumbers && context.localizeText('yes') || context.localizeText('no');
    } else if ([MovementTypes.t261, MovementTypes.t262].includes(item.MovementType)) {
        propObj.WorkOrder = item.OrderNumber;
    } else if ([MovementTypes.t281, MovementTypes.t282].includes(item.MovementType)) {
        propObj.NetworkActivity = item?.Network + '/' + item?.NetworkActivity;
    }
    return propObj;
}

export function SpecialStockToListpickerItem(clientAPI, specialStockInd) {
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'SpecialStockTexts', [], `$filter=SpecialStock eq '${specialStockInd}'`)
        .then((/** @type {ObservableArray<SpecialStockText>} */ result) => ValidationLibrary.evalIsEmpty(result) ? specialStockInd : `${specialStockInd} - ${result.getItem(0).Description}`);
}
