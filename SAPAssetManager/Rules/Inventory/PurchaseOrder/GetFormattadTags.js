export default function GetFormattedTags(clientAPI) {
    let tags = [];
    const purchaseOrder = clientAPI.binding;

    if (purchaseOrder['@odata.readLink'] && purchaseOrder['@odata.readLink'].includes('MaterialDocuments')) {
        const tabs = [];
        let item = purchaseOrder.RelatedItem[0];
        if (item) {
            let movType = item.MovementType;
            tabs.push(movType);
        }
        return tabs;
    }

    tags.push(purchaseOrder.DocumentType);

    let documentStatus = purchaseOrder.DocumentStatus;

    if (documentStatus === 'B' || !documentStatus) { //Ignore partial for now, and use open if not set
        documentStatus = 'A';
    }
    switch (documentStatus) {
        case 'A':
            tags.push(clientAPI.localizeText('open'));
            break;
        case 'B':
            tags.push(clientAPI.localizeText('inbound_document_partial'));
            break;
        case 'C':
            tags.push(clientAPI.localizeText('inbound_document_completed'));
            break;
    }
    
    return tags;
}
