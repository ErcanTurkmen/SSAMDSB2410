import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function SoldToPartyPickerServiceRequestOnValueChange(control) {
    ResetValidationOnInput(control);
    ServiceRequestControlsLibrary.updateBillToParty(control);
    ServiceRequestControlsLibrary.updateSalesOrg(control);
    ServiceRequestControlsLibrary.updateServiceOrg(control);
}
