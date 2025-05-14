import libCommon from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import { SubOperationControlLibrary as libSubOpControl } from '../../../SubOperations/SubOperationLibrary';
import Logger from '../../../Log/Logger';

export default async function SubOperationCreateUpdateWorkorderChanged(control) {
    try {
        const pageProxy = control.getPageProxy();
        const formCellContainer = pageProxy.getControl('FormCellContainer');

        if (libVal.evalIsNotEmpty(formCellContainer)) {
            const workOrderLstPkrValue = libCommon.getListPickerValue(formCellContainer.getControl('WorkOrderLstPkr').getValue());

            let params = {
                funcLocControl: formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control,
                funcLocExtension: formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension(),
                equipmentControl: formCellContainer.getControl('EquipHierarchyExtensionControl')._control,
                equipmentExtension: formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension(),
                descriptionControl: formCellContainer.getControl('DescriptionNote'),
                equipValue: '',
                flocValue: '',
                descriptionValue: '',
                planningPlant: '',
                enable: false,
                pageProxy: pageProxy,
            };

            if (workOrderLstPkrValue) {
                const workOrderData = await control.read('/SAPAssetManager/Services/AssetManager.service', workOrderLstPkrValue, ['OrderType', 'PlanningPlant'], '')
                    .then(result => {
                        return result.length ? result.getItem(0) : null;
                    });

                if (workOrderData) {
                    params.planningPlant = workOrderData.PlanningPlant;

                    const orderTypeData = await control.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${workOrderData.OrderType}' and PlanningPlant eq '${workOrderData.PlanningPlant}'`)
                        .then(myOrderTypes => {
                            return myOrderTypes.length ? myOrderTypes.getItem(0) : null;
                        });

                    if (orderTypeData) {
                        params.enable = (orderTypeData.ObjectListAssignment === '');
                    }
                }
            }

            return libSubOpControl.updateEquipFuncLocAfterWorkOrderChange(params).then(() => {
                return updateOperationAfterWorkOrderChange(formCellContainer, workOrderLstPkrValue);
            });
        }
    } catch (err) {
        Logger.error(control.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), `SubOperationCreateUpdateWorkorderChanged Error: ${err}`);
    }

    return Promise.resolve(false);
}

function updateOperationAfterWorkOrderChange(formCellContainer, workOrderLstPkrValue) {
    const operationLstPkrControl = formCellContainer.getControl('OperationLstPkr');
    const operationTargetSpecifier = operationLstPkrControl.getTargetSpecifier();

    if (libVal.evalIsNotEmpty(workOrderLstPkrValue)) {
        operationTargetSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        operationTargetSpecifier.setEntitySet(workOrderLstPkrValue + '/Operations');
        operationTargetSpecifier.setDisplayValue('{{#Property:OperationNo}} - {{#Property:OperationShortText}}');
        operationTargetSpecifier.setReturnValue('{@odata.readLink}');
        operationTargetSpecifier.setQueryOptions('$orderby=OperationNo');
        operationLstPkrControl.setValue('');

        return operationLstPkrControl.setTargetSpecifier(operationTargetSpecifier).then(() => {
            operationLstPkrControl.setEditable(true);
            return Promise.resolve(true);   
        });
    } else {
        operationLstPkrControl.setEditable(false);
        operationLstPkrControl.setValue('');
    }
    
    return Promise.resolve(true);   
}
