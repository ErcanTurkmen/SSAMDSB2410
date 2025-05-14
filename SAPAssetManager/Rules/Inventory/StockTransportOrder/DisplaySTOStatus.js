import AllowIssueForSTO from '../StockTransportOrder/AllowIssueForSTO';

export default function DisplaySTOStatus(clientAPI) {
    
    let sto = clientAPI.binding;
 
    let documentStatus = sto.DocumentStatus;

    if (documentStatus === 'B' || !documentStatus) { //Ignore partial for now, and use open if not set
        documentStatus = 'A';
    }
    let issue = AllowIssueForSTO(sto);
    switch (documentStatus) {
        case 'A':
            return clientAPI.localizeText('open');
        case 'B':
            if (issue) {
                return clientAPI.localizeText('outbound_document_partial');
            } else {
                return clientAPI.localizeText('inbound_document_partial');
            }
        case 'C':
            if (issue) {
                return clientAPI.localizeText('outbound_document_completed');
            } else {
                return clientAPI.localizeText('inbound_document_completed');
            }
    }
    return documentStatus;
}
