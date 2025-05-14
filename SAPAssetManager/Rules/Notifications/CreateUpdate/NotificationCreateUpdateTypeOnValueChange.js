import notification from '../NotificationLibrary';
import updateGroupPickers from './UpdateGroupPickers';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import prioritySelector from './NotificationCreateUpdatePrioritySelector';
import EMPButtonIsVisible from '../EMP/EMPButtonIsVisible';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function NotificationCreateUpdateTypeOnValueChange(context) {
    ResetValidationOnInput(context);
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
