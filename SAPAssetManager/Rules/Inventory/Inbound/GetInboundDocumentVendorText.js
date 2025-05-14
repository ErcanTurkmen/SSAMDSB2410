import common from '../../Common/Library/CommonLibrary';
import getMaterialData from '../ProductionOrder/GetMaterialData';
import Reservation from '../Reservation/Reservation';
import { GetFirstOpenItemForDocument } from '../IssueOrReceipt/BulkUpdate/BulkUpdateLibrary';
export default function GetInboundDocumentVendorText(clientAPI) {
    const binding = clientAPI.getBindingObject();
    
    if (binding) {
        switch (binding.IMObject) {
            case 'ST':
                if (binding.StockTransportOrderHeader_Nav.SupplyingPlant) {
                    return common.getPlantName(clientAPI, binding.StockTransportOrderHeader_Nav.SupplyingPlant);
                }
                break;
            case 'PO':
                if (binding.PurchaseOrderHeader_Nav.Vendor) {
                    return common.getVendorName(clientAPI, binding.PurchaseOrderHeader_Nav.Vendor);
                }
                break;
            case 'PR':
                if (binding.PurchaseRequisitionHeader_Nav && binding.PurchaseRequisitionHeader_Nav.PurchaseRequisitionItem_Nav) {
                    if (binding.PurchaseRequisitionHeader_Nav.PurchaseRequisitionItem_Nav.length >= 1) {
                        let item = binding.PurchaseRequisitionHeader_Nav.PurchaseRequisitionItem_Nav[0];
                        return item.DocType;
                    }
                }
                break;
            case 'IB':
                if (binding.InboundDelivery_Nav.Vendor) {
                    return common.getVendorName(clientAPI, binding.InboundDelivery_Nav.Vendor);
                }
                break;
            case 'OB':
                if (binding.OutboundDelivery_Nav.ReceivingPlant) {
                    return common.getPlantName(clientAPI, binding.OutboundDelivery_Nav.ReceivingPlant);
                }
                break;
            case 'RS':
                if (binding.OutboundDelivery_Nav) {
                    const receivingPlant = binding.OutboundDelivery_Nav.ReceivingPlant;
                    const shipToParty = binding.OutboundDelivery_Nav.ShipToParty;
            
                    if (receivingPlant) {
                        return common.getPlantName(clientAPI, receivingPlant);
                    } else if (shipToParty) {
                        return common.getCustomerName(clientAPI, shipToParty);
                    }
            
                } else if (binding.ReservationHeader_Nav) {
                    const reservation = new Reservation(clientAPI, binding.ReservationHeader_Nav);
                    const recipient = reservation.getRecipient();
                    return recipient;
                }
                break;
                case 'PI':
                    if (binding.PhysicalInventoryDocHeader_Nav) {
                        let plant = binding.PhysicalInventoryDocHeader_Nav.Plant ? binding.PhysicalInventoryDocHeader_Nav.Plant : '-';
                        let sloc = binding.PhysicalInventoryDocHeader_Nav.StorLocation ? binding.PhysicalInventoryDocHeader_Nav.StorLocation : '-';
                        if (plant !== '-' || sloc !== '-') {
                            return `${plant}/${sloc}`;
                        }
                    } 
                    return '';
                case 'PRD':
                    if (binding.ProductionOrderHeader_Nav) {
                        return getMaterialData(clientAPI);
                    }
                    return '';
                case 'MDOC':
                    if (binding.MaterialDocument_Nav?.MaterialDocNumber) {
                        return GetFirstOpenItemForDocument(clientAPI, 'MaterialDocument', binding.MaterialDocument_Nav).then(item => {
                            return item?.MovementType;
                        });
                    }
                    return '';
        }
    }

    return '';
}

