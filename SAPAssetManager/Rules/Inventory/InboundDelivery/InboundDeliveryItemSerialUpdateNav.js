import InboundNavWrapper from './InboundNavWrapper';

export default function InboundDeliveryItemSerialUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InboundDeliveryItem_Nav`, [], '$expand=InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav').then(result => { 
        if (result && result.length > 0) {
            let item = result.getItem(0);
            context.setActionBinding(item);
            return InboundNavWrapper(context);
        }
        return true;
    });
}
