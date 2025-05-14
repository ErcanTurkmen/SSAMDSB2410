import libCom from '../../../Common/Library/CommonLibrary';
import resetListPageVariables from '../ResetListPageVariables';
import libVal from '../../../Common/Library/ValidationLibrary';

export const SpecialStock = Object.freeze({
    OrdersOnHand: 'E',
    ConsignmentVendor: 'K',
    ProjectStock: 'Q',
    PipelineStock: 'P',
    ConsignmentCustomer: 'W',
});

export const MovementTypes = Object.freeze({
    t101: '101',  // Goods receipt for purchase order into warehouse/stores
    t102: '102',  // Goods receipt for purchase order into warehouse - reversal
    t103: '103',  // Goods receipt for purchase order into GR blocked stock
    t104: '104',  // Goods receipt for purchase order -> GR blkd stock - reversal
    t105: '105',  // Release GR blocked stock for customer stock
    t106: '106',  // Release GR blocked stock for customer stock - reversal
    t107: '107',  // Goods Receipt to Valuated Blocked Stock Project
    t108: '108',  // Goods Receipt to Valuated Blocked Stock Project - Reversal
    t109: '109',  // Goods Receipt from Valuated Blocked Stock Project
    t110: '110',  // Goods Receipt from Valuaed Blocked Stock Project - Reversal
    t122: '122',  // Return delivery to vendor
    t123: '123',  // Reversal of ret. delivery
    t124: '124',  // Return delivery from GR blocked stock
    t125: '125',  // Return delivery from GR blocked stock - reversal
    t161: '161',  // Returns for purchase order
    t201: '201',  // Consumption for cost center from pipeline
    t202: '202',  // Consumption for cost center from pipeline - reversal
    t221: '221',  // Consumption for project from project
    t222: '222',  // Consumption for project from project - reversal
    t231: '231',  // Consumption for sales order from unrestricted project stock
    t232: '232',  // Consumption for sales order from unrestr. project - reversal
    t241: '241',  // Consumption for asset from consignment
    t242: '242',  // Consumption for asset from consignment - reversal
    t251: '251',  // Consumption for sales from consignment stores
    t252: '252',  // Consumption for sales from consignment - reversal
    t261: '261',  // Consumption for order from consignment at customer
    t262: '262',  // Consumption for order from consignment at customer -reversal
    t281: '281',  // Consumption for network from unrestricted project
    t282: '282',  // Consumption for network from unrestricted project - reversal
    t291: '291',  // Consumption for all accnt assigmts from customer consignment
    t292: '292',  // Consump. for all accnt assigmts from cstmr consgmt - Revers.
    t301: '301',  // Transfer posting plant to plant (one-step)
    t302: '302',  // Transfer posting plant to plant (one-step) - reversal
    t303: '303',  // Transf. Posting Plant to Plant - Rem.from Sto. - Cust Stock
    t304: '304',  // Tfr. Posting Plant to Plant - Rem.from Sto. - Cust Stk - Rev
    t305: '305',  // Transf. Posting Plant to Plant - Place in Sto. - Cst Stock
    t306: '306',  // Tfr. Posting Plant to Plant - Place in Sto. - Cust Stk - Rev
    t309: '309',  // Transfer posting cust. consgmt material to material
    t30A: '30A',  // Transfer Posting Plant to SC Stock - Remove
    t30B: '30B',  // Transfer Posting Plant to SC Stock - Remove - Reversal
    t30C: '30C',  // Transfer Posting Plant to SC Stock - Put Away
    t30D: '30D',  // Transfer Posting Plant to SC Stock - Put Away - Reversal
    t310: '310',  // Transfer posting cust. consgmt mat. to mat. - reversal
    t311: '311',  // Transfer posting storage location (one-step) - project
    t312: '312',  // Transfer posting stor. loc. (one-step) - project - reversal
    t313: '313',  // Transfer posting SLoc to SLoc - remove from storage
    t314: '314',  // Tfr. posting SLoc to SLoc - remove from storage - reversal
    t315: '315',  // Transfer posting SLoc. to SLoc. - place in storage
    t316: '316',  // Transfer posting SLoc to SLoc - place in storage - reversal
    t317: '317',  // Creation of a structured material
    t318: '318',  // Creation of a structured material - reversal
    t319: '319',  // Split structured material into components
    t320: '320',  // Split structured mat. into components - reversal
    t321: '321',  // Transfer posting QI customer consignment to unrestr. stock
    t322: '322',  // Transfer posting QI cust. consgmt to unrestr. stck - revers.
    t323: '323',  // Transfer posting QI project to QI project within plant
    t324: '324',  // Transfer posting QI project to QI project in plant - revers.
    t325: '325',  // Transfer posting blocked project to blocked project in plant
    t326: '326',  // Transfer posting blkd project to blkd proj. in plant - rev.
    t331: '331',  // Withdrawal for sampling from QI consigment st. at customer
    t332: '332',  // Withdrawal for sampling from QI csgmt stock at cust. - rev.
    t333: '333',  // Withdrawal for sampling from unrestr. csgmt st. at customer
    t334: '334',  // Withdrawal for sampling from unr. csgmt st. at cust. - rev.
    t335: '335',  // Withdrawal for sampling from blocked csgmt stock at customer
    t336: '336',  // Withdrawal for sampling from blkd csgmt st. at cust. - rev.
    t343: '343',  // Transfer posting blocked project to unrestricted project
    t344: '344',  // Transfer posting blocked project to unrestr. proj. - revers.
    t349: '349',  // Transfer posting blocked project to QI project
    t350: '350',  // Transfer posting locked project to QI project - reversal
    t351: '351',  // Transfer posting to stock in transit from unrestricted-use
    t352: '352',  // Trfr pstng to stock in transit from unrestr.-use - reversal
    t411: '411',  // Transfer Posting Iss. Val. SiT to Iss. Plant
    t412: '412',  // Transfer Posting Iss. Val. SiT to Iss. Plant - Reversal
    t413: '413',  // Transfer Posting Iss. Val. SiT to Sales Order
    t414: '414',  // Transfer Posting Iss. Val. SiT to Sales Order - Reversal
    t415: '415',  // Transfer Posting Iss. Val. SiT to Project
    t416: '416',  // Transfer Posting Iss. Val. SiT to Project - Reversal
    t417: '417',  // Transfer Posting Iss. Val. SiT to Iss. Plant in One Step
    t418: '418',  // Transfer Posting Iss. Plant to Iss. Val. SiT in One Step
    t419: '419',  // Transf.Posting Blocked Sales Order Stock to Blocked Own Stk
    t420: '420',  // Trans.Posting Blckd Sales Ord.Stock to Own Blckd - Reversal
    t421: '421',  // Transfer Posting Qual.Insp. SO Stock to Own Qual.Insp. Stock
    t422: '422',  // Transfer Posting Qual.Insp. SO Stock to Own QI - Reversal
    t423: '423',  // Transf.Posting Blocked Sales Order Stock to Own Free Avail.
    t424: '424',  // Trans.Posting Blckd Sales Ord.Stock to Own Free - Reversal
    t425: '425',  // Transfer Posting Qual.Insp. SO Stock to Own Free Available
    t426: '426',  // Transfer Posting Qual.Insp. SO Stock to Own Free - Reversal
    t427: '427',  // Transfer Posting Blocked to Own Sales Order Stock
    t428: '428',  // Transfer Posting Blocked to Own Sales Order Stock - Reversal
    t429: '429',  // Transfer Posting Qual.Insp. to Own Sales Order Stock
    t430: '430',  // Trans. Posting Qual.Insp. to Own Sales Ord.Stock - Reversal
    t441: '441',  // Transfer posting non-tied to tied empties
    t442: '442',  // Transfer posting non-tied to tied empties - reversal
    t451: '451',  // Customer returns
    t452: '452',  // Returns from customer - reversal
    t453: '453',  // Transfer posting to own stock from returns from customer
    t454: '454',  // Trfr pstng to own stck from returns from customer - reversal
    t455: '455',  // Stock transfer returns to returns
    t456: '456',  // Stock transfer returns to returns - reversal
    t457: '457',  // Stock transfer returns to QI
    t458: '458',  // Stock transfer returns to QI - reversal
    t459: '459',  // Stock transfer returns to blocked
    t460: '460',  // Stock transfer returns to blocked - reversal
    t501: '501',  // Receipt w/o purchase order into unrestricted project
    t502: '502',  // Receipt w/o purchase order into unrestr. project - reversal
    t503: '503',  // Receipt w/o purchase order into QI project
    t504: '504',  // Receipt w/o purchase order into QI project - reversal
    t505: '505',  // Receipt w/o purchase order into blocked project stock
    t506: '506',  // Receipt w/o purchase order into blocked project - reversal
    t511: '511',  // Receipt of delivery without charge RTP
    t512: '512',  // Receipt of delivery without charge RTP - reversal
    t521: '521',  // Receipt w/o production order into unrestricted project
    t522: '522',  // Receipt w/o production order into unrestr. project - revers.
    t523: '523',  // Receipt w/o production order into QI project
    t524: '524',  // Receipt w/o production order into QI project - reversal
    t525: '525',  // Receipt w/o production order into blocked project
    t526: '526',  // Receipt w/o production order into blocked project - reversal
    t531: '531',  // Receipt of by-product into unrestricted project
    t532: '532',  // Receipt of by-product into unrestricted project - reversal
    t541: '541',  // Trfr pstng to stock with subcontractor from unrestr.-use st.
    t542: '542',  // Trfr pstg to stock w. subcontr. from unrestr.-use - reversal
    t543: '543',  // Consumption from Stock of Material Provided to Vendor
    t551: '551',  // Withdrawal for scrapping from unrestr.-use customer consgmt
    t552: '552',  // Withdrawal for scrapp. fr. unrestr. cust. consgmt - reversal
    t553: '553',  // Withdrawal for scrapping from QI customer consignment
    t554: '554',  // Withdrawal for scrapping from QI customer consignment
    t555: '555',  // Withdrawal for Scrapping from Issuing Valuated SiT
    t556: '556',  // Withdrawal for Scrapping from Iss. Val. SiT - Reversal
    t557: '557',  // Issue from project stock in transit (adjustment posting)
    t558: '558',  // Receipt into project stock in transit (adjustment posting)
    t559: '559',  // Issue from Valuated Bl. Stock Project (Adjustment Posting)
    t560: '560',  // Receipt in Valuated Bl.Stock Project (Adjustment Posting)
    t561: '561',  // Rcpt per init. entry of st. bal. to unr. consgmt at customer
    t562: '562',  // Rcpt per init. entry of st. bal. to unr.cons.at cust. - rev.
    t563: '563',  // Receipt per init. entry of st. bal. to QI consgmt at custom.
    t564: '564',  // Rcpt per init.entry of st. bal. to QI cons.at cust. - rev.
    t565: '565',  // Receipt per initial entry of stock bal. to blocked project
    t566: '566',  // Receipt per initial entry of stock bal. to blkd proj. - rev.
    t571: '571',  // Receipt for assembly order to unrestricted project
    t572: '572',  // Receipt for assembly order to unrestr. proj. - reversal
    t573: '573',  // Receipt for assembly order to QI project
    t574: '574',  // Receipt for assembly order to QI project - reversal
    t575: '575',  // Receipt for assembly order to blocked project
    t576: '576',  // Receipt for assembly order to blocked project - reversal
    t581: '581',  // Receipt by-product to unrestricted project from network
    t582: '582',  // Receipt by-product to unrestr. project from network - rev.
    t63A: '63A',  // Transfer Posting Unrestr. to Cust. Consig. Transfer - Remove
    t63B: '63B',  // Transfer Posting Unrestr. to Cust. Consig. Transfer - Revers
    t63C: '63C',  // Transfer Posting Cust. Consig. Transfer to Cust. Consig. Unr
    t63D: '63D',  // Trans. Pstg Cust. Consig. Trans. to Cust. Consig. Unr.- Rev.
});

export const GRBlockReleaseMovementTypes = Object.freeze({
    t105: '105',  // Release GR blocked stock for customer stock
    t106: '106',  // Release GR blocked stock for customer stock - reversal
    t109: '109',  // Goods Receipt from Valuated Blocked Stock Project
    t110: '110',  // Goods Receipt from Valuaed Blocked Stock Project - Reversal
});
export const EditableGRBlockReleaseMovementTypes = Object.freeze([
    GRBlockReleaseMovementTypes.t105,
    GRBlockReleaseMovementTypes.t106,
    GRBlockReleaseMovementTypes.t109,
    GRBlockReleaseMovementTypes.t110,
]);

export const GRBlockedMovementTypes = Object.freeze({
    t103: '103',  // Goods receipt for purchase order into GR blocked stock
    t107: '107',  // Goods Receipt to Valuated Blocked Stock Project
});
export const EditableGRBlockedMovementTypes = Object.freeze([
    GRBlockedMovementTypes.t103,
    GRBlockedMovementTypes.t107,
]);

export const SpecialStockMovementTypes = Object.freeze({
    t201: '201',  // Consumption for cost center from pipeline
    t202: '202',  // Reversal for cost center
    t221: '221',  // Consumption for project from project
    t222: '222',  // Reversal for project
    t231: '231',  // Consumption for sales order from unrestricted project stock
    t261: '261',  // Consumption for order from consignment at customer
    t262: '262',  // Reversal for Order
    t281: '281',  // Consumption for network from unrestricted project
    t282: '282',  // Reversal for Network
    t301: '301',  // Transfer posting plant to plant (one-step)
    t303: '303',  // Transf. Posting Plant to Plant - Rem.from Sto. - Cust Stock
    t305: '305',  // Transf. Posting Plant to Plant - Place in Sto. - Cst Stock
    t311: '311',  // Transfer posting storage location (one-step) - project
    t313: '313',  // Transfer posting SLoc to SLoc - remove from storage
    t315: '315',  // Transfer posting SLoc. to SLoc. - place in storage
    t321: '321',  // Transfer posting QI customer consignment to unrestr. stock
    t322: '322',  // Transfer posting from quality inspection to unrestricted stock
    t343: '343',  // Transfer posting blocked project to unrestricted project
    t411: '411',  // Transfer Posting SLoc to SLoc (one-step)
    t501: '501',  // Receipt w/o purchase order into unrestricted project
    t502: '502',  // Goods Receipt w/o PO - (reversal)
    t551: '551',  // Withdrawal for scrapping from unrestr.-use customer consgmt
    t552: '552',  // GI scrapping - (reversal)
    t553: '553',  // Withdrawal for scrapping from QI customer consignment
    t555: '555',  // Withdrawal for Scrapping from Issuing Valuated SiT
});
export const ListSpecialStockMovementTypes = Object.freeze([
    SpecialStockMovementTypes.t201,
    SpecialStockMovementTypes.t202,
    SpecialStockMovementTypes.t221,
    SpecialStockMovementTypes.t222,
    SpecialStockMovementTypes.t231,
    SpecialStockMovementTypes.t261,
    SpecialStockMovementTypes.t262,
    SpecialStockMovementTypes.t281,
    SpecialStockMovementTypes.t282,
    SpecialStockMovementTypes.t301,
    SpecialStockMovementTypes.t303,
    SpecialStockMovementTypes.t305,
    SpecialStockMovementTypes.t311,
    SpecialStockMovementTypes.t313,
    SpecialStockMovementTypes.t315,
    SpecialStockMovementTypes.t321,
    SpecialStockMovementTypes.t322,
    SpecialStockMovementTypes.t343,
    SpecialStockMovementTypes.t411,
    SpecialStockMovementTypes.t501,
    SpecialStockMovementTypes.t502,
    SpecialStockMovementTypes.t551,
    SpecialStockMovementTypes.t552,
    SpecialStockMovementTypes.t553,
    SpecialStockMovementTypes.t555,
]);

export const InventoryOrderTypes = Object.freeze({
    PO: 'PO',    // Purchase Order
    STO: 'STO',  // Stock Transport Order
    RES: 'RES',  // Reservation
    REV: 'REV',  // Reverse
    IB: 'IB',   // Inbound Delivery
    OB: 'OB',   // Outbound Delivery
    PRD: 'PRD',  // Production Order
});

export const InventoryDocumentHeaderStatus = Object.freeze({
    Open: 'A',
    Partial: 'B',
    Completed: 'C',
});

export const InventoryAdhoc = Object.freeze({
    ADHOC: 'ADHOC',    // ADHOC
});

export const GoodsMovementCode = Object.freeze({
    GoodsReceiptPO: '01',
    GoodsReceiptPRD: '02',
    GoodsIssue: '03',
    TransferPosting: '04',
    OtherGoodsReceipt: '05',
    Reversal: '06',
});

export const AccountAssignments = Object.freeze({ CostCenter: 'K', Order: 'F', Network: 'N', Project: 'P' });

export const EditableAccountAssignments = Object.freeze([
    AccountAssignments.CostCenter,
    AccountAssignments.Order,
    AccountAssignments.Network,
    AccountAssignments.Project,
]);

export default class {
    /**
     * Opens document details page for the Inventory Persona
     */
    static openInventoryDocDetailsPage(context, entitySet, queryOptions) {
        let query = queryOptions;
        if (!query.includes('$expand=')) {
            const toExpand = [
                'OutboundDelivery_Nav',
                'ReservationHeader_Nav',
                'PurchaseOrderHeader_Nav',
                'StockTransportOrderHeader_Nav',
                'InboundDelivery_Nav',
                'PhysicalInventoryDocHeader_Nav',
                'PhysicalInventoryDocHeader_Nav/PhysicalInventoryDocItem_Nav',
                'ProductionOrderHeader_Nav/ProductionOrderItem_Nav/Material_Nav',
                'MaterialDocument_Nav/RelatedItem',
                'MaterialDocument_Nav/MatDocAttachment_Nav',
                'PurchaseRequisitionHeader_Nav/PurchaseRequisitionLongText_Nav',
                'PurchaseRequisitionHeader_Nav/PurchaseRequisitionItem_Nav/PurchaseRequisitionLongText_Nav',
            ];
            query += `&$expand=${toExpand.join(',')}`;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(data => {
            if (data.length === 1) {
                libCom.setStateVariable(context, 'EmptySearchOnOverview', true);
                let docInfo = data.getItem(0);
                if (docInfo.PurchaseOrderHeader_Nav) {
                    resetListPageVariables(context);
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PurchaseOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PurchaseOrder/PurchaseOrderDetailsNav.action');
                } else if (docInfo.InboundDelivery_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.InboundDelivery_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/Inbound/InboundDeliveryDetailNav.action');
                } else if (docInfo.StockTransportOrderHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.StockTransportOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderDetailsNav.action');
                } else if (docInfo.OutboundDelivery_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.OutboundDelivery_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action');
                } else if (docInfo.ReservationHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.ReservationHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/Reservation/ReservationDetailsNav.action');
                } else if (docInfo.PhysicalInventoryDocHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PhysicalInventoryDocHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetailsNav.action');
                } else if (docInfo.ProductionOrderHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.ProductionOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/ProductionOrder/ProductionOrderDetailsNav.action');
                } else if (docInfo.PurchaseRequisitionHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PurchaseRequisitionHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionDetailsNav.action');
                } else if (docInfo.MaterialDocument_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.MaterialDocument_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsIMNav.action');
                }
            }
            return false;
        });
    }

    /**
     * Getting actual value of material field for IM document
     */
    static getInventoryDocumentMaterialNum(item) {
        let type = item['@odata.type'].substring('#sap_mobile.'.length);
        let materialNum = '-1'; // default value if we don't have Materal Num
        if (type === 'MaterialDocItem' || type === 'InboundDeliveryItem'
            || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem'
            || type === 'PurchaseRequisitionItem') {
            materialNum = item.Material;
        } else if (item.MaterialNum) {
            materialNum = item.MaterialNum;
        }
        return materialNum;
    }
    /**
     * This function returns if the material is a free text material
     */
    static isFreeTextMaterial(materialNum) {
        return materialNum === '-1'; // default value if we don't have Materal Num
    }
    /**
     * Update state of deleted documents for the IM persona view
     */
    static updateDeletedDocsState(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], "$filter=Action eq 'D'").then(results => {
            if (results) {
                libCom.setStateVariable(context, 'IMPersonaRemovedObjectIds', results);
            } else {
                libCom.removeStateVariable(context, 'IMPersonaRemovedObjectIds');
            }
        });
    }

    /**
     * Get the Deleted Documents from Inventory Overview
     */
    static removeDeletedItems(context, baseQueryFilter) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], "$filter=Action eq 'D'&$orderby=ObjectId").then(results => {
            if (libVal.evalIsEmpty(results)) {
                return baseQueryFilter;
            }
            const terms = Array.from(results, i => i.ObjectId)
                .map(ObjectId => `ObjectId ne '${ObjectId}' and OrderId ne '${ObjectId}'`).join(' and ');
            return baseQueryFilter ? [baseQueryFilter, terms].join(' and ') : `$filter=${terms}`;
        });
    }

    /**
     * Check the movementtype criteria for displaying StockType cache, update it and redraw the page
     * @param {*} selectedMovementType
     * @returns true if selectedMovementType is not one of the types listed
    */
    static isStockTypeVisible(selectedMovementType) {
        return [MovementTypes.t103, MovementTypes.t105, MovementTypes.t107, MovementTypes.t109, MovementTypes.t553, MovementTypes.t555].every((p) => p !== (selectedMovementType));
    }

    /**
     * gets the Hide.PhysicalInventory.SummaryPage value in application parameters
     * @param {IClientAPI} clientAPI
     */
    static getHidePhysicalInventorySummaryPage(clientAPI) {
        return libCom.getAppParam(clientAPI, 'INVENTORY', 'Hide.PhysicalInventory.SummaryPage') !== 'N';
    }

    /**
     * gets the CheckToleranceLimit.PhysicalInventory value in application parameters
     * @param {IClientAPI} context
     */
    static getCheckToleranceLimitPhysicalInventory(context) {
        return libCom.getAppParam(context, 'INVENTORY', 'CheckToleranceLimit.PhysicalInventory') !== 'N';
    }

    /**
    * gets the CheckToleranceLimit.PhysicalInventory value in application parameters
    * @param {IClientAPI} context
    */
    static getToleranceLimitPercentPhysicalInventory(context) {
        return Number(libCom.getAppParam(context, 'INVENTORY', 'ToleranceLimitPercent.PhysicalInventory'));
    }

    /**
    * gets the CheckStock.GoodsIssue value in application parameters
    * @param {IClientAPI} context
    */
    static getCheckStockGoodsIssue(context) {
        return libCom.getAppParam(context, 'INVENTORY', 'CheckStock.GoodsIssue') !== 'N';
    }
    
    static GetListPickerSelection(listpickerControlProxy) {
        const selection = listpickerControlProxy?.getValue();
        if (libVal.evalIsEmpty(selection) || libVal.evalIsEmpty(selection[0].ReturnValue)) {
            return '';
        }
        return selection[0].ReturnValue;
     }

     /**
      * Set the binding for the item details page 
      * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
      * @param {String} entitySet 
      * @param {String} query 
      * @returns newActionBinding
      * 
      * Note: this is a fix for the issue where the creating adhoc documents from item details page
      * would not work because the binding was not set properly.
      * Adhoc documents require the binding to have the entity properties to be set at binding level, not binding.item property
      * Details page uses binding.item property to get the entity properties
      */
     static SetItemDetailsBinding(context, entitySet, query) {
        /** @type {IPageProxy} */
        const pageProxy = context.getPageProxy();
        const actionBinding = pageProxy.getActionBinding();

        /** @type {import('../Item/ItemsData').ItemDetailsBinding} */
        const newActionBinding = actionBinding;
        newActionBinding.ItemsQuery = { entitySet, query };
        newActionBinding.item = actionBinding;
        pageProxy.setActionBinding(newActionBinding);
        return newActionBinding;
    }
}
