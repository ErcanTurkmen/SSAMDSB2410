import CommonLibrary from '../../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import { isControlPopulated } from '../../../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/RequiredFields';
import NotificationLibrary from '../../../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';


export default function NotificationItemCauseCreateUpdateDonePressed(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const requiredFields = [...(isControlPopulated('GroupLstPkr', formCellContainer) ? ['CodeLstPkr','DescriptionTitle'] : [])];  // the parent picker is required, the child is required only if the parent is already selected (user cannot select it without the parent first)
    const anyRequiredFields = ['GroupLstPkr'];

    if (anyRequiredFields.map(controlName => isControlPopulated(controlName, formCellContainer)).every(i => !i)) {  // if none of the description, group picker are filled out, make them required
        requiredFields.push(...anyRequiredFields);
    }
    const charLimitFields = { DescriptionTitle: parseInt(CommonLibrary.getAppParam(context, 'NOTIFICATION', 'DescriptionLength')) };
    const isValid = NotificationLibrary.Validate(context, formCellContainer, requiredFields, charLimitFields);
    return isValid ? context.executeAction('/SAPAssetManager/Rules/Notifications/Item/Cause/CreateUpdate/NotificationItemCauseCreateUpdateOnCommit.js') : '';
}
