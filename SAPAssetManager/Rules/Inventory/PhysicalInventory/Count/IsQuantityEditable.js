/**
* sets the editable property of serial number field
* @param {IClientAPI} context
*/
import { SerialNumberEditable } from './OnQuantityChange';
export default function IsQuantityEditable(context) {
    return !!(SerialNumberEditable(context));
}
