import WCMNotesCount from './WCMNotesCount';

export default async function WCMNotesSectionFooterVisible(context) {
    return (await WCMNotesCount(context)) > 2;
}
