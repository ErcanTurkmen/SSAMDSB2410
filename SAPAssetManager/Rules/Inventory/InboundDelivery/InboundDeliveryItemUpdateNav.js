import InboundNavWrapper from './InboundNavWrapper';

export default function InboundDeliveryItemUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}`, [], '$expand=InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav').then(result => { 
        if (result && result.length > 0) {
            let item = result.getItem(0);
            context.setActionBinding(item);
            return InboundNavWrapper(context);
        }
        return true;
    });
}
