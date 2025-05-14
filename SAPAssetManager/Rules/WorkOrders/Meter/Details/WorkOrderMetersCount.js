import CommonLibrary from '../../../Common/Library/CommonLibrary';
import MeterSectionLibrary from '../../../Meter/Common/MeterSectionLibrary';

export default function WorkOrderMetersCount(context) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context, context.getPageProxy().binding);
    let isuLink = woBinding.OrderISULinks[0];
    if (isuLink.ISUProcess === 'DISCONNECT' || isuLink.ISUProcess === 'RECONNECT') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', woBinding['@odata.readLink'] + '/DisconnectActivity_Nav', [], '').then(function(result) {
            if (result && result.length > 0) {
                return CommonLibrary.getEntitySetCount(context, result.getItem(0)['@odata.readLink'] + '/DisconnectObject_Nav', '');
            } else {
                return '0';
            }
        });
    } else {
        return CommonLibrary.getEntitySetCount(context, woBinding['@odata.readLink'] + '/OrderISULinks', '$filter=sap.entityexists(Device_Nav)');
    }
}
