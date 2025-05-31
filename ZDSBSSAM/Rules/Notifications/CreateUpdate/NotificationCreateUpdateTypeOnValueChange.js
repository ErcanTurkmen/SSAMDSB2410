import notification from '../NotificationLibrary';
import updateGroupPickers from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/UpdateGroupPickers';
import userFeaturesLib from '../../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import prioritySelector from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdatePrioritySelector';
import EMPButtonIsVisible from '../../../../SAPAssetManager/Rules/Notifications/EMP/EMPButtonIsVisible';
import ResetValidationOnInput from '../../../../SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput';
import NotificationCreateUpdateShowFieldsChange from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateShowFieldsChange';

export default function NotificationCreateUpdateTypeOnValueChange(context) {
    ResetValidationOnInput(context);
    /* DSB Custosmzation for Type 31 41 hiding the feilds NotifType */
    let NotificationType = context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue');
    if (NotificationType === '41' || NotificationType === '31') {
        NotificationCreateUpdateShowFieldsChange(context, false);
    }
    //End of changes
    //Only allow the user to set part group and damage group once type has been set
    context.getPageProxy().evaluateTargetPath('#Control:PartGroupLstPkr').setEditable(true);
    context.getPageProxy().evaluateTargetPath('#Control:DamageGroupLstPkr').setEditable(true);
    return EMPButtonIsVisible(context).then(() => {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
            return prioritySelector(context).then(() => updateGroupPickers(context.getPageProxy())).finally(() => {
                return notification.setFailureAndDetectionGroupQuery(context);
            });
        } else {
            return notification.NotificationCreateUpdatePrioritySelector(context).then(() => updateGroupPickers(context.getPageProxy())).finally(() => {
                return notification.setFailureAndDetectionGroupQuery(context);
            });
        }
    });
}
