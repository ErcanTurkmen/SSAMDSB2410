import WCMNotesLibrary from './WCMNotesLibrary';

export default async function WCMNoteSectionCaption(context) {
    const list = await WCMNotesLibrary.getListNoteTypesAllowedForCreationByObjectType(context);

    if (list.length === 1) {
        return WCMNotesLibrary.getNoteCaption(context, list[0]);
    }

    return '';
}
