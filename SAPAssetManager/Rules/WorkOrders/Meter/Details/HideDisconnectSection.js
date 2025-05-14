import libCommon from '../../../Common/Library/CommonLibrary';
import libMeterSection from '../../../Meter/Common/MeterSectionLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function HideDisconnectSection(context) {
    const woBinding = libMeterSection.getWorkOrderBinding(context, context.getPageProxy().binding);
    
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) &&
        libCommon.isDefined(woBinding.OrderISULinks)) {
        const isDisconnect = ['DISCONNECT', 'RECONNECT'].includes(woBinding.OrderISULinks[0]?.ISUProcess);
        // If section is Meter List don't show on Disconnect
        if (context.getName() === 'MeterList') {
            return !isDisconnect;
        } else {
            return isDisconnect;
        }
    }
    return false;
}
