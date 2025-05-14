import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateOnChange(controlProxy) {
    ResetValidationOnInput(controlProxy);
    libOperationEvent.createUpdateOnChange(controlProxy);
}
