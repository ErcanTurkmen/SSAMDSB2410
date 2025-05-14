import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

/**
* Clear Validation on Value Change
* @param {IClientAPI} context
*/
export default function OnValueChange(context) {
    ResetValidationOnInput(context);
    return context.executeAction('/SAPAssetManager/Actions/SignatureControl/Create/SignatureCreateToastMessage.action');
}
