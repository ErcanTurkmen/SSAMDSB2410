import WCMNotesLibrary from './WCMNotesLibrary';

export default function WCMNotesListDataSubscritions(context) {
    return WCMNotesLibrary.getLongTextEntitySet(context);
}
