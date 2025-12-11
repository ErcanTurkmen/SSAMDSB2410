import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';
import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

/**
 * Sets current date to  be posted on blank confirmation..
 */
export default function ConfirmationBlankSetDates(context) {
	let defaultEnd = new Date();
	let odataDate = new ODataDate(defaultEnd);
    return odataDate.toLocalDateString(context);

}
