import libCommon from '../Common/Library/CommonLibrary';

/**
* Get list of InspectionCodes and sort by code
* @param {IClientAPI} context
* @param {String} queryOptions
* @returns {Array} sorted list of options for ListPicker/Segmented control
*/
export default function InspectionCodesSortedPickerItems(context, queryOptions) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionCodes', [], queryOptions).then((result) => {
        const sortedItems = [...result._array].sort((a,b) => {
            const codeA = a.Code;
            const codeB = b.Code;

            // compare as strings if one of items not numeric or or numeric with prefix 0 ('0001' and '1'), otherwise compare as numbers
            if (`${+codeA}` !== codeA || `${+codeB}` !== codeB) {
                return codeA.localeCompare(codeB);
            } else {
                return codeA - codeB;
            }
        });

        return sortedItems.map((item) => {
            return {
                'DisplayValue': item.CodeDesc,
                'ReturnValue': libCommon.decodeReadLink(item['@odata.readLink']),
            };
        });
    });
}
