import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import { isControlPopulated } from '../../../CreateUpdate/RequiredFields';
import NotificationLibrary from '../../../NotificationLibrary';


export default function NotificationItemCauseCreateUpdateDonePressed(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const requiredFields = [...(isControlPopulated('GroupLstPkr', formCellContainer) ? ['CodeLstPkr'] : [])];  // the parent picker is required, the child is required only if the parent is already selected (user cannot select it without the parent first)
    const anyRequiredFields = ['DescriptionTitle', 'GroupLstPkr'];

    if (anyRequiredFields.map(controlName => isControlPopulated(controlName, formCellContainer)).every(i => !i)) {  // if none of the description, group picker are filled out, make them required
        requiredFields.push(...anyRequiredFields);
    }
    const charLimitFields = { DescriptionTitle: parseInt(CommonLibrary.getAppParam(context, 'NOTIFICATION', 'DescriptionLength')) };
    const isValid = NotificationLibrary.Validate(context, formCellContainer, requiredFields, charLimitFields);
    return isValid ? context.executeAction('/SAPAssetManager/Rules/Notifications/Item/Cause/CreateUpdate/NotificationItemCauseCreateUpdateOnCommit.js') : '';
}
