import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function ConfirmationSuccess(context) {
    let isFinalConfirmation;
    let binding = context.getBindingObject();
    if (binding.selectedOperations) {
        binding = context.getActionBinding();
        for (const [key, value] of Object.entries(binding)) {
            binding[key] = value;
        }
    }

    //Save the final confirmation flag to the state variable for OperationMobileStatusLibrary/SubOperationMobileStatusLibrary to use
    if (Object.prototype.hasOwnProperty.call(binding, 'isFinalConfirmation')) {
        isFinalConfirmation = binding.isFinalConfirmation;
    } else if (Object.prototype.hasOwnProperty.call(binding, 'FinalConfirmation')) {
        isFinalConfirmation = binding.FinalConfirmation;
    } else {
        isFinalConfirmation = libCommon.getControlProxy(context, 'IsFinalConfirmation').getValue();
    }
    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    libCommon.setStateVariable(context, 'IsFinalConfirmation', isFinalConfirmation, libCommon.getPageName(previousPage));
    
    //Handle removing clock in/out records after time entry
    libCommon.setStateVariable(context, 'ClockTimeSaved', true);
    return libClock.removeUserTimeEntries(context, '', false, true);
}
