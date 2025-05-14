
import Logger from '../Log/Logger';
import ODataLibrary from '../OData/ODataLibrary';

export default function GetTOTPOnLoaded(context) {
    context.showActivityIndicator(context.localizeText('create_device'));
    return ODataLibrary.initializeOnlineService(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/CreateTOTPDevice.action').then(() => {
            context.dismissActivityIndicator();
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'TOTP Create Device failed' + error);
            context.dismissActivityIndicator();
        });
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Online Service Failed' + error);
        context.dismissActivityIndicator();
    });
}
