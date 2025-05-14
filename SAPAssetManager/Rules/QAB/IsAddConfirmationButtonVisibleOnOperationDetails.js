import ConfirmationEntryCreateVisible from '../Confirmations/CreateUpdate/ConfirmationEntryCreateVisible';
import PersonaLibrary from '../Persona/PersonaLibrary';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import IsAddConfirmationButtonVisible from './IsAddConfirmationButtonVisible';

export default function IsAddConfirmationButtonVisibleOnOperationDetails(context) {
    if (PersonaLibrary.isMaintenanceTechnician(context)) {
        return EnableWorkOrderEdit(context).then(isEditEnabled => {
            if (!isEditEnabled) return false;
            if (!IsAddConfirmationButtonVisible(context)) return false;

            return ConfirmationEntryCreateVisible(context);
        });
    } 

    return false;
}
