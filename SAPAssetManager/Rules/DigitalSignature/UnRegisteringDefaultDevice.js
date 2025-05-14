import Logger from '../Log/Logger';
import ODataLibrary from '../OData/ODataLibrary';

export default function UnRegisterDefaultDevice(context) {
    return ODataLibrary.initializeOnlineService(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDefaultTOTPDevice.action').then(() => {
             return Promise.resolve(true);
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'TOTP Unregister Device failed' + error);
            return Promise.resolve(false);
        });
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Online Service Failed' + error);
            return context.executeAction('/SAPAssetManager/Actions/Common/ServiceUnavailable.action').then(() => {
                return Promise.resolve(false);
            });
        });
}
