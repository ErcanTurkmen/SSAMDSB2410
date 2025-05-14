import EnableConfirmationCreate from '../../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import ConfirmationsIsEnabled from '../ConfirmationsIsEnabled';
import ConfirmationCreateIsEnabled from './ConfirmationCreateIsEnabled';

/**
* Check if confirmation is enabled and can be created for WO
* @param {IClientAPI} context
*/
export default function ConfirmationCreateFromWOIsEnabled(context) {
    return ConfirmationsIsEnabled(context) &&
        EnableConfirmationCreate(context) &&
        ConfirmationCreateIsEnabled(context);
}
