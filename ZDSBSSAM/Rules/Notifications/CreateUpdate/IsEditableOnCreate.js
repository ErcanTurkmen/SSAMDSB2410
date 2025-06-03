/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function IsEditableOnCreate(clientAPI) {

	var onCreate = libCom.IsOnCreate(clientAPI);
	if (onCreate) {
		return true;

	} else {
		return false;
	}
}