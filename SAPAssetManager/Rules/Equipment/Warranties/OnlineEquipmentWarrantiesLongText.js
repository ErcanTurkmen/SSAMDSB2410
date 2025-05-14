import libVal from '../../Common/Library/ValidationLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

/**
 * Get the Warranty Long Text
 * @param {*} context SectionProxy object.
 * @returns {String} Long Text string
 */
export default async function OnlineEquipmentWarrantiesLongText(context) {
    let masterWarrantyNumber = context.binding.MasterWarrantyNum;
    if (!libVal.evalIsEmpty(masterWarrantyNumber)) {
        try {
            const longText = context.read('/SAPAssetManager/Services/OnlineAssetManager.service', `EquipmentWarrantyLongText('${masterWarrantyNumber}')`);
            if (longText && longText.getItem(0)) {
                return ValueIfExists(longText.getItem(0).TextString);
            }
            return '-';
        } catch (err) {
            return '-';
        }
    } else {
        return '-';
    }
}
