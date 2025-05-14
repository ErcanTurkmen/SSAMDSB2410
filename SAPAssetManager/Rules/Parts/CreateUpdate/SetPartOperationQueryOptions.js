import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import Logger from '../../Log/Logger';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

export default function SetPartOperationQueryOptions(context) {
    ResetValidationOnInput(context);
    //On material change, re-filter MaterialUOMLstPkr by material
    try {
        let operationListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:OperationLstPkr');
        let operationLstPkrSpecifier = operationListPicker.getTargetSpecifier();
        let operationLstPkrQueryOptions = '';

        if (context.getValue().length > 0) {
            operationLstPkrQueryOptions = "$filter=OrderId eq '" + context.getValue()[0].ReturnValue + "'&$orderby=OperationNo";
        } 

        operationLstPkrSpecifier.setEntitySet('MyWorkOrderOperations');
        operationLstPkrSpecifier.setQueryOptions(libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, operationLstPkrQueryOptions));
        operationListPicker.setTargetSpecifier(operationLstPkrSpecifier);
    } catch (err) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), `PartLibrary.partCreateUpdateOnChange(MaterialLstPkr) error: ${err}`);
    }
}
