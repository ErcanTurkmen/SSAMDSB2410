import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/**
* Check if the Confirmation is local and show the 
* description Hide it otherwise
* @param {IClientAPI} clientAPI
*/
export default function ConfirmationDescription(clientAPI) {
    return ValidationLibrary.evalIsEmpty(clientAPI.binding.Description) ? '-' : clientAPI.binding.Description;
}
