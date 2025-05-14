import libCommon from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import { setCurrency } from './FormHandlers/OnWorkOrderValueChange';

export default function ExpenseCreateUpdateOnPageLoaded(context) {
    setInitialValues(context);

    context.getClientData().DefaultValuesLoaded = true;
    context.getClientData().LOADED = true;

    libCommon.saveInitialValues(context);
}

function setInitialValues(context) {
    if (!libEval.evalIsEmpty(context.binding)) {
        context.getClientData().currentObject = {};

        if (libEval.evalIsEmpty(context.binding.Description)) {
            context.binding.Description = '';
        }

        if (libEval.evalIsEmpty(context.binding.ActivityType)) {
            context.binding.ActivityType = '';
        }
        
        let operationControl = context.getControl('FormCellContainer').getControl('OperationLstPkr');
        let workOrderControl = context.getControl('FormCellContainer').getControl('WorkOrderLstPkr');
        
        //Binding object is Confirmation or WorkOrderHeader
        let orderId = context.binding.OrderID || context.binding.OrderId || '';
        if (libEval.evalIsEmpty(orderId)) {
            libCommon.setFormcellNonEditable(operationControl);
            libCommon.setFormcellEditable(workOrderControl);
        } else {
            libCommon.setFormcellNonEditable(workOrderControl);
            libCommon.setFormcellEditable(operationControl);
            setCurrency(context, orderId);
        }

        getOperationValue(context);

        if (context.binding.CreatedDate) {
            let dateControl = context.getControl('FormCellContainer').getControl('CreateDatePicker');
            let date = new OffsetODataDate(context,context.binding.CreatedDate,context.binding.CreatedTime);
            dateControl.setValue(date.date());
        }
    } else if (!libEval.evalIsEmpty(context.getClientData().currentObject)) {
        let binding = context.getClientData().currentObject;
        let container = context.getControl('FormCellContainer');
        
        container.getControl('WorkOrderLstPkr').setValue(binding.OrderID);
        libCommon.setFormcellNonEditable(container.getControl('WorkOrderLstPkr'));
        libCommon.setFormcellEditable(container.getControl('OperationLstPkr'));

        container.getControl('ExpenseTypeLstPkr').setValue(binding.ActivityType);
        container.getControl('AmountProperty').setValue(binding.ActualWork);
        container.getControl('OperationLstPkr').setValue(binding.Operation);
        container.getControl('WorkCenterPicker').setValue(binding.WorkCenter);
        container.getControl('CommentProperty').setValue(binding.Description);

        if (binding.CreatedDate) {
            let dateControl = container.getControl('CreateDatePicker');
            let date = new OffsetODataDate(context,binding.CreatedDate,binding.CreatedTime);
            dateControl.setValue(date.date());
        }

        setCurrency(context, binding.OrderID);
    } else {
        context.getClientData().currentObject = {};
    }
}

function getOperationValue(context) {
    if (libEval.evalIsEmpty(context.binding.Operation)) {
        context.binding.Operation = '';
    }
}
