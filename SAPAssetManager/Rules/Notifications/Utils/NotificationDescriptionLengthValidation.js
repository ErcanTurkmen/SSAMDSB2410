
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function NotificationDescriptionLengthValidation(control) {
    ValidationLibrary.controlSetMaxLengthValidation(control, parseInt(CommonLibrary.getAppParam(control, 'NOTIFICATION', 'DescriptionLength')));
}
