import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import {SubOperationEventLibrary as libSubOpEvent} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateOnChange(controlProxy) {
    ResetValidationOnInput(controlProxy);
    libSubOpEvent.createUpdateOnChange(controlProxy);
}
