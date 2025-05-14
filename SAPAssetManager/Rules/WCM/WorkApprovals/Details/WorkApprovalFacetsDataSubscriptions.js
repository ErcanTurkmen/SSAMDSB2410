import WCMNotesLibrary from '../../WCMNotes/WCMNotesLibrary';

export default function WorkApprovalFacetsDataSubscriptions(context) {
    return [WCMNotesLibrary.getLongTextEntitySet(context)];
}
