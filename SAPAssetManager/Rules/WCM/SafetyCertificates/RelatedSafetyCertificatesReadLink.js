import libVal from '../../Common/Library/ValidationLibrary';

export default function RelatedSafetyCertificatesReadLink(binding) {
    if (libVal.evalIsEmpty(binding)) {
        return 'WCMDocumentHeaders';
    }

    switch (binding['@odata.type']) {
        case '#sap_mobile.MyEquipment':
        case '#sap_mobile.MyFunctionalLocation':
            return binding['@odata.readLink'] + '/WCMDocumentHeaders_Nav';
        case '#sap_mobile.WCMDocumentItem':
            return binding['@odata.readLink'] + '/WCMDocumentHeaders';
        default:
            return 'WCMDocumentHeaders';
    }
}
