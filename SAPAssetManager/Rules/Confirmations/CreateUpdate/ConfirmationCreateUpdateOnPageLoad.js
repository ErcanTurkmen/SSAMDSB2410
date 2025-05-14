import style from '../../Common/Style/StyleFormCellButton';
import libCom from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import LaborTimeMinuteInterval from '../CreateUpdate/LaborTimeMinuteInterval';
import ODataDate from '../../Common/Date/ODataDate';
import onUpdate from '../../Confirmations/CreateUpdate/IsOnUpdate';
import activityTypeDefault from '../CreateUpdate/ActivityTypeDefault';

export default function ConfirmationCreateUpdateOnPageLoad(context) {
    hideCancel(context);
    let stylizer = new Stylizer(['GrayText']);
    const formCellContainerProxy = context.getControl('FormCellContainer');
    if (!context.getBindingObject().IsOnCreate) {
        style(context, 'DiscardButton');
    }

    if (!context.getBindingObject().IsWorkOrderChangable) {
        let woPicker = formCellContainerProxy.getControl('WorkOrderLstPkr');
        stylizer.apply(woPicker, 'Value');

        if (onUpdate(context)) { //Only do this during edit, or MDK puts the wrong caption on the last screen field
            let confirmationId = formCellContainerProxy.getControl('ConfirmationIdProperty');
            stylizer.apply(confirmationId, 'Value');
        }

        if (!context.getBindingObject().IsOperationChangable) {
            let opPicker = formCellContainerProxy.getControl('OperationPkr');
            stylizer.apply(opPicker, 'Value');
            if (!context.getBindingObject().IsSubOperationChangable) {
                let subOpPicker = formCellContainerProxy.getControl('SubOperationPkr');
                stylizer.apply(subOpPicker, 'Value');
            }
        }

    }

    return returnLaborTimeMinuteInterval(context, formCellContainerProxy);
}

function returnLaborTimeMinuteInterval(context, formCellContainerProxy) {
    return LaborTimeMinuteInterval(context, context.getBindingObject().OrderID, context.getBindingObject().Operation, context.getBindingObject().Operation).then(duration => { //Handle clock in/out processing if necessary
        let durationControl = formCellContainerProxy.getControl('DurationPkr');
        durationControl.setValue(duration);

        if (context.getBindingObject().IsOnCreate) {
            let startDateTime;

            if (libCom.isDefined(context.getBindingObject().PostingDate)) {
                startDateTime = new ODataDate(context.getBindingObject().PostingDate);
            } else {
                startDateTime = new ODataDate();
            }

            startDateTime.date().setMinutes(startDateTime.date().getMinutes() - duration);

            let startDateControl = formCellContainerProxy.getControl('StartDatePicker');
            startDateControl.setValue(startDateTime.date());

            let startTimeControl = formCellContainerProxy.getControl('StartTimePicker');
            startTimeControl.setValue(startDateTime.date());
        }

        //Set initial control values from binding
        let woControl = formCellContainerProxy.getControl('WorkOrderLstPkr');
        let opControl = formCellContainerProxy.getControl('OperationPkr');
        let subControl = formCellContainerProxy.getControl('SubOperationPkr');
        let varControl = formCellContainerProxy.getControl('VarianceReasonPkr');
        let actControl = formCellContainerProxy.getControl('ActivityTypePkr');
        let indicatorControl = formCellContainerProxy.getControl('AcctIndicatorPkr');

        if (context.getBindingObject().OrderID) {
            woControl.setValue(context.getBindingObject().OrderID);
        }

        if (context.getBindingObject().Operation) {
            opControl.setValue(context.getBindingObject().Operation);
        }

        if (context.getBindingObject().SubOperation) {
            subControl.setValue(context.getBindingObject().SubOperation);
        }

        if (context.getBindingObject().VarianceReason) {
            varControl.setValue(context.getBindingObject().VarianceReason);
        }

        if (context.getBindingObject().AccountingIndicator) {
            indicatorControl.setValue(context.getBindingObject().AccountingIndicator);
        }

        if (context.getBindingObject().ActivityType) {
            actControl.setValue(context.getBindingObject().ActivityType);
        } else {
            actControl.setValue(activityTypeDefault(context));
        }

        libCom.saveInitialValues(context);
        return true;
    });
}
