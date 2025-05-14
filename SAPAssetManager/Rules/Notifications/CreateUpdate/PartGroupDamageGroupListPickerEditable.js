import NotificationTypeLstPkrDefault from '../NotificationTypePkrDefault';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* Editable rule for Part Group and Damage Group List Picker
* Notification Type must be set to a valid value before Part Group and Damage Group Editable can be set to true
* @param {Context} context
*/
export default function PartGroupDamageGroupListPickerEditable(context) {
    return NotificationTypeLstPkrDefault(context).then((type) => {
        if (libVal.evalIsEmpty(type)) {
            return false;
        } else {
            return true;
        }
    });
}
