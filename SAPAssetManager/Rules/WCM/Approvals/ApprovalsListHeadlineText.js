import SafetyCertificateDetailsCaption from '../SafetyCertificates/Details/SafetyCertificateDetailsCaption';
import WorkPermitDetailsCaption from '../WorkPermitDetails/WorkPermitDetailsCaption';

export default function ApprovalsListHeadlineText(context) {
    switch (context.binding['@odata.type']) {
        case '#sap_mobile.WCMApplication':
            return WorkPermitDetailsCaption(context);
        case '#sap_mobile.WCMDocumentHeader':    
            return SafetyCertificateDetailsCaption(context);
    } 
}
