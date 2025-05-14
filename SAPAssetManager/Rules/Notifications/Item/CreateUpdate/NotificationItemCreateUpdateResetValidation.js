import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function NotificationItemCreateUpdateResetValidation(context) {
    const pageProxy = context.getPageProxy();
    const formcellContainerProxy = pageProxy.getControl('FormCellContainer');
    ['ItemDescription', 'PartGroupLstPkr', 'DamageGroupLstPkr'].map(name => formcellContainerProxy.getControl(name))
        .forEach(control => ResetValidationOnInput(control));
}
