export default function OperationalItemsListViewEntitySet(context) {
    const binding = context.binding;
    const dataType = binding && binding['@odata.type'];
    
    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue()) {
        return `${binding['@odata.readLink']}/WCMDocumentItems`;
    } else {
        return 'WCMDocumentItems';
    }
}
