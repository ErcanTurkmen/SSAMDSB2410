import ResetValidationOnInput from '../../../../Common/Validation/ResetValidationOnInput';
import notification from '../../../NotificationLibrary';

export default function NotificationItemActivityCreateUpdateCode(context) {
    ResetValidationOnInput(context);
    return notification.NotificationTaskActivityCreateUpdateCode(context, 'CatTypeActivities');
}
