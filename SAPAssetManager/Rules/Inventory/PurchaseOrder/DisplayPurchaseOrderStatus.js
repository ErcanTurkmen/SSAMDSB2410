export default function DisplayPurchaseOrderStatus(clientAPI) {
    
    const po = clientAPI.binding;
 
    let documentStatus = po.DocumentStatus;

    if (documentStatus === 'B' || !documentStatus) { //Ignore partial for now, and use open if not set
        documentStatus = 'A';
    }

     switch (documentStatus) {
        case 'A':
            return clientAPI.localizeText('open');
        case 'B':
                return clientAPI.localizeText('inbound_document_partial'); 
        case 'C':  
                return clientAPI.localizeText('inbound_document_completed');    
    }
    return documentStatus;
}
