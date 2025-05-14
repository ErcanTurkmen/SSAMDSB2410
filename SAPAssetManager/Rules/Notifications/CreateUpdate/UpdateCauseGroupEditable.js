import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function UpdateCauseGroupEditable(context) {
    // 'Cause Group' is allowed for input only if DamageDetailsLstPkr || PartDetailsLstPkr entity was entered or exists
    const pageProxy = context.getPageProxy();
    const formcellContainerProxy = pageProxy.getControl('FormCellContainer');
    const isAnyRelatedFieldsFilled = ['ItemDescription', 'DamageDetailsLstPkr', 'PartDetailsLstPkr']
        .some(controlName => !ValidationLibrary.evalIsEmpty(formcellContainerProxy.getControl(controlName)?.getValue()));
    SetCauseGroupEditable(formcellContainerProxy, isAnyRelatedFieldsFilled);
}

function SetCauseGroupEditable(formcellContainerProxy, setEditable) {
    ['CauseGroupLstPkr', 'CauseDescription']
        .map(controlName => formcellContainerProxy.getControl(controlName))
        .forEach(control => {
            control?.setEditable(setEditable);
            if (!setEditable) {
                control?.setValue('');
            }
        });
}
