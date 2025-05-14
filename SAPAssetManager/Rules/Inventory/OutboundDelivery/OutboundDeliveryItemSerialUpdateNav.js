import OutboundNavWrapper from './OutboundNavWrapper';

export default function OutboundDeliveryItemSerialUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/OutboundDeliveryItem_Nav`, [], '$expand=OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav').then(result => { 
        if (result && result.length > 0) {
            let item = result.getItem(0);
            context.setActionBinding(item);
            return OutboundNavWrapper(context);
        }
        return true;
    });
}
