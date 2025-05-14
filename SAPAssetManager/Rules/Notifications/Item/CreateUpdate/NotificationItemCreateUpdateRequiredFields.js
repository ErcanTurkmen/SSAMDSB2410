import { NotificationItemRequiredFields } from '../../CreateUpdate/RequiredFields';

export default function NotificationItemCreateUpdateRequiredFields(context) {
    const formcellContainerProxy = context.getPageProxy().getControl('FormCellContainer');
    const requiredFields = NotificationItemRequiredFields(formcellContainerProxy);
    const parentPickerNames = ['PartGroupLstPkr', 'DamageGroupLstPkr'];

    return ['ItemDescription', ...parentPickerNames, ...requiredFields];
}
