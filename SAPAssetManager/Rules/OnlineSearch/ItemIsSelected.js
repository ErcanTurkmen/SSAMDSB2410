import libCommon from '../Common/Library/CommonLibrary';

export default function ItemIsSelected(context) {
    const selectedItems = libCommon.getStateVariable(context, 'selectedItems');
    return selectedItems &&
        selectedItems.findIndex(i => i.binding['@odata.readLink'] === context.binding['@odata.readLink']) !== -1;
}
