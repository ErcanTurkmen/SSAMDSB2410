import ResetValidationOnInput from '../../../../Common/Validation/ResetValidationOnInput';
import notification from '../../../NotificationLibrary';

export default function NotificationItemTaskCreateUpdateCode(context) {
    ResetValidationOnInput(context);
    return notification.NotificationTaskActivityCreateUpdateCode(context, 'CatTypeCauses').then(() => {
        let codePicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:CodeLstPkr');
        codePicker.setEditable(context.getPageProxy().evaluateTargetPath('#Control:CauseGroupLstPkr').editable);
    });
}
