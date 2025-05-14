import WCMNotesLibrary from '../WCMNotes/WCMNotesLibrary';

export default function WorkPermitFacetsDataSubscriptions(context) {
    return ['Documents', 'WCMApplicationAttachments', WCMNotesLibrary.getLongTextEntitySet(context)];
}
