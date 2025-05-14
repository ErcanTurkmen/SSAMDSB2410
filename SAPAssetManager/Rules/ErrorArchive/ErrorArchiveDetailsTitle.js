/**
* Describe this function...
* @param {IClientAPI} context
*/
import libErr from './ErrorArchiveLibrary';

export default function ErrorArchiveDetailsTitle(context) {
    let errorObject = context.getPageProxy().binding.ErrorObject;
    if (errorObject) {
        try {
            let message = JSON.parse(errorObject.Message);
            return libErr.parseErrorTitle(message, message.error.message.value);
        } catch (e) {
            return libErr.parseErrorTitle(errorObject.Message, errorObject.Message);
        }
    } 
    return '-';
}
