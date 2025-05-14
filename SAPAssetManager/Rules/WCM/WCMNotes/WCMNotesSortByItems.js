import WCMNotesLibrary from './WCMNotesLibrary';

export default async function WCMNotesSortByItems(context) {
    const list = await WCMNotesLibrary.getListNoteTypesAllowedForCreationByObjectType(context);

    return list.map((item) => {
        return {
            DisplayValue: WCMNotesLibrary.getNoteCaption(context, item),
            ReturnValue: item,
        };
    });
}
