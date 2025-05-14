/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetDateTimeKeyboardTypeIphone(context) {
    return context.nativescript.platformModule.Device.model === 'iPhone' ? 'DateTime' : 'Number';
}
