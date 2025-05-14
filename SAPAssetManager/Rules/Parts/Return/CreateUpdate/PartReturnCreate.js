import isSerialized from '../../Issue/SerialParts/SerialPartsAreAllowed';
import issuedSerialNumberQuery from '../../Issue/SerialParts/SerialNumbersIssuedQuery';
import libCom from '../../../Common/Library/CommonLibrary';

/**
* If serialized material, only allow return if number serial numbers exist
* @param {IClientAPI} context
*/
export default function PartReturnCreate(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding() || context.binding;

    let action = '/SAPAssetManager/Actions/Parts/PartReturnCreateChangeset.action';

    if (isSerialized(context, binding)) {
        libCom.setStateVariable(context, 'PartReturnSerial', true); //Used when creating the specialized array later
        return issuedSerialNumberQuery(context, binding).then((serialNumsArray) => {
            if (serialNumsArray && serialNumsArray.length > 0) {
                binding.serialNumsArray = serialNumsArray;
                pageProxy.setActionBinding(binding);
            } else {
                action = '/SAPAssetManager/Actions/Parts/PartReturnNoSerialNums.action';
            }
            return pageProxy.executeAction(action);
        });
    } else {
        return pageProxy.executeAction(action);
    }
}
