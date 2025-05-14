import CommonLibrary from '../../../Common/Library/CommonLibrary';
import NotificationLibrary from '../../NotificationLibrary';
import NotificationItemCreateUpdateRequiredFields from './NotificationItemCreateUpdateRequiredFields';

export default function NotificationItemCreateUpdateDonePressed(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const requiredFields = NotificationItemCreateUpdateRequiredFields(context);
    const charLimitFields = { ItemDescription: parseInt(CommonLibrary.getAppParam(context, 'NOTIFICATION', 'DescriptionLength')) };
    const isValid = NotificationLibrary.Validate(context, formCellContainer, requiredFields, charLimitFields);
    return isValid ? context.executeAction('/SAPAssetManager/Rules/Notifications/Item/CreateUpdate/NotificationItemCreateUpdateOnCommit.js') : '';
}
