import InboundNavWrapper from './InboundNavWrapper';

export default function InboundDeliveryUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'InboundDeliveryItems', [], `$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$expand=InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav&$orderby=Item&$top=1`).then(result => { 
        if (result && result.length > 0) {
            let item = result.getItem(0);
            context.setActionBinding(item);
            return InboundNavWrapper(context);
        }
        return true;
    });
}
