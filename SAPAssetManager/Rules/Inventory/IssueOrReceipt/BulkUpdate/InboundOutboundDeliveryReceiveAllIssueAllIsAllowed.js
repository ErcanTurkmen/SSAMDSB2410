
import GetValuationType from '../Valuations/GetValuationType';
import QueryBuilder from '../../../Common/Query/QueryBuilder';

const INBOUND_DELIVERY = 'InboundDelivery';

export default async function InboundOutboundDeliveryReceiveAllIssueAllIsAllowed(context, binding) {
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);
    let deliveryItems = await GetInboundOrOutboundDeliveryItemsData(context, binding, type);
    return ValidateDeliveryIssueAllReceiveAll(deliveryItems);
}

async function GetInboundOrOutboundDeliveryItemsData(context, binding, type) {
    const isIBD = (type === INBOUND_DELIVERY);
    const deliveryEntitySet = isIBD ? 'InboundDeliveryItems' : 'OutboundDeliveryItems';
    const deliveryNumber = binding.DeliveryNum;
    const expand = isIBD ? 'InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav' : 'OutboundDelivery_Nav,OutboundDeliverySerial_Nav,MaterialPlant_Nav';
    
    const queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`DeliveryNum eq '${deliveryNumber}' and (PickedQuantity ne Quantity)`);
    queryBuilder.addExpandStatement(`${expand}`);
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', deliveryEntitySet, [], queryBuilder.build())
    .then(async (results) => {
        return await Promise.all(results.map(async item => {
            return {
                ...item, 
                ValuationTypeCalculated : await GetValuationType(context, item),
                SerialNumbers: isIBD ? item.InboundDeliverySerial_Nav : item.OutboundDeliverySerial_Nav,
            };
        }));
    });
}

function ValidateDeliveryIssueAllReceiveAll(deliveryItems) {
    //To allow issue all/ receive all for deliverys, all the items should be valid
    //Storage location cannot be empty
    //Batch cannot be empty for Batch-managed materials
    //Serial Numbers cannot be empty for Serialized materials
    //Valuation type cannot be empty for Valuated materials
    return !deliveryItems.some(result=>{
        return ((result.StorageLocation === '') || 
                (result.MaterialPlant_Nav?.BatchIndicator && result.Batch === '') || 
                (result.MaterialPlant_Nav?.SerialNumberProfile && result.SerialNumbers.length !== result.Quantity) ||
                (result.MaterialPlant_Nav?.ValuationCategory && result.ValuationTypeCalculated === ''));
    });
}
