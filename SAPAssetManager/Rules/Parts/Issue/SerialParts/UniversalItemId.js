import libCom from '../../../Common/Library/CommonLibrary';
import isDefenseEnabled from '../../../Defense/isDefenseEnabled';

/**
 * Read the UniqueItemIdentifier from MyEquipSerialNumbers when issuing a part serial number 
 * Only applicable for defense feature
 * @param {*} context 
 * @returns 
 */
export default async function UniversalItemId(context) {
    if (isDefenseEnabled(context)) {
        let index = libCom.getStateVariable(context,'SerialPartsCounter');
        let serialNumPicker = context.evaluateTargetPath('#Control:SerialNumLstPkr/#Value');
        let sloc = libCom.getListPickerValue(libCom.getFieldValue(context, 'StorageLocationLstPkr', '', null, true));
        let serial = serialNumPicker[index].ReturnValue; //The current serial number we are posting
        let target = context.binding['@odata.readLink'] + '/Material/SerialNumbers'; //The operation part's serial numbers
        let filter = `$filter=SerialNumber eq '${serial}' and StorageLocation eq '${sloc}'`;
        let results =  await context.read('/SAPAssetManager/Services/AssetManager.service', target, ['UniqueItemIdentifier'], filter);

        if (results && results.length > 0) {
            return results.getItem(0).UniqueItemIdentifier;
        }
    }
    return '';
}
