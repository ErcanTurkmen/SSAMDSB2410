import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';
import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

/**
 * Sets current date to  be posted on blank confirmation..
 */
export default function ConfirmationBlankSetTime(context) {
	let currentTime = libCommon.getStateVariable(context, 'ConfirmationTime');
	return currentTime;

}
