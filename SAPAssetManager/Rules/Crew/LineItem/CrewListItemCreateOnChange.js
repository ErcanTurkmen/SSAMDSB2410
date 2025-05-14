import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import libCrew from '../CrewLibrary';

export default function CrewListItemCreateOnChange(control) {
    ResetValidationOnInput(control);
    libCrew.crewListItemCreateOnChange(control);
}
