import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import fromOpsList from '../IsOperationCreateFromOperationsList';

export default function RequiredFields(context) {
    let req = [
        'DescriptionNote',
        'ControlKeyLstPkr',
        'WorkCenterLstPkr',
        'WorkCenterPlantLstPkr',
    ];

    if (fromOpsList(context)) {
        req.push('WorkOrderLstPkr');
    }

    const stkControl = context.getControl('FormCellContainer').getControl('StandardTextKeyListPicker');
    if (stkControl.visible && !ValidationLibrary.evalIsEmpty(stkControl.getValue()) && stkControl.getValue()[0].ReturnValue !== context.binding.StandardTextKey && !CommonLibrary.IsOnCreate(context)) {
        req.push('ChangeExistingDescriptionSegmented');
    }
    return req;
}
