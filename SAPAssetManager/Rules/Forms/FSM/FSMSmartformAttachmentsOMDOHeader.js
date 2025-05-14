import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import BackendAppVersionNumber from '../../UserProfile/BackendAppVersionNumber';

export default async function FSMSmartformAttachmentsOMDOHeader(context) {
    let omdoID = 'XX_FSM_FORM_ATTACHMENT';
    let appVersion = await BackendAppVersionNumber(context);
    if (appVersion) {
        omdoID = omdoID.replace('XX', `SAM${appVersion}`);
    }
    if (IsS4ServiceIntegrationEnabled(context)) {
        omdoID = omdoID.concat('_S4');
    }
    return omdoID;
}
