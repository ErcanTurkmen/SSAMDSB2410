import libCom from '../../../Common/Library/CommonLibrary';

/**
 * Should the next button be shown on physical inventory count screen?
 * There needs to be more items to count
 * @param {*} context
 * @returns
 */
export default function IsNextButtonVisible(context) {

    const itemsMap = libCom.getStateVariable(context, 'PIDocumentItemsMap');
    return itemsMap.length > 1;
}
