import WCMNotesLibrary from '../../WCMNotes/WCMNotesLibrary';

export default function CertificateFacetsDataSubscriptions(context) {
    return [WCMNotesLibrary.getLongTextEntitySet(context)];
}
