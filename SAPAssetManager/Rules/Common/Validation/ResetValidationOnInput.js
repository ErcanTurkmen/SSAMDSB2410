import CommonLibrary from '../Library/CommonLibrary';

/**
* Function that targets validation library to clear input if something was entered
* @param {IClientAPI} context
*/
export default function ResetValidationOnInput(context) {
    CommonLibrary.clearValidationOnInput(context);
}
