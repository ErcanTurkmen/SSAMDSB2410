import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
//upgrade 2410 done
export default function ZEnableAddPRT(context) {
    let operationNo = context.binding?.OperationNo;
    if (operationNo !== '0010' && operationNo !== '0011') {
        return true;
    }
    else
    {
        return false;
    }
}
