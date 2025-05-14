import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SubOperationRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'ControlKeyLstPkr',
        'WorkCenterLstPkr',
        'WorkCenterPlantLstPkr',
    ];

    ['WorkOrderLstPkr', 'OperationLstPkr'].forEach(name => {
        try {
            if (context.evaluateTargetPathForAPI(`#Control:${name}`).visible) {
                requiredFields.push(name);
            }
        } catch (err) {
            Logger.error('SubOperationRequiredFields', err);
        }
    });

    const stkControl = context.getControl('FormCellContainer').getControl('StandardTextKeyListPicker');
    if (stkControl.visible && !ValidationLibrary.evalIsEmpty(stkControl.getValue()) && stkControl.getValue()[0].ReturnValue !== context.binding.StandardTextKey && !CommonLibrary.IsOnCreate(context)) {
        requiredFields.push('ChangeExistingDescriptionSegmented');
    }

    return requiredFields;
}
