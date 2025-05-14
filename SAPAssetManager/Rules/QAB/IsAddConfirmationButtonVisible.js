import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import EnableConfirmationCreate from '../UserAuthorizations/Confirmations/EnableConfirmationCreate';

export default function IsAddConfirmationButtonVisible(context) {
    return ConfirmationsIsEnabled(context) && EnableConfirmationCreate(context);
}
