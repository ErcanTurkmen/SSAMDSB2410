import NotesListViewEntitySet from './NotesListViewEntitySet';
import S4NotesLibrary from './NotesListLibrary';

export default async function NotesListViewCaption(context) {
    const allCountQuery = S4NotesLibrary.getNotesListQuery(context, false);
    const filteredCountQuery = S4NotesLibrary.getNotesListQuery(context, false, true);

    const notesEntitySet = NotesListViewEntitySet(context);
    const allCount = await context.count('/SAPAssetManager/Services/AssetManager.service', notesEntitySet, allCountQuery);
    const filteredCount = await context.count('/SAPAssetManager/Services/AssetManager.service', notesEntitySet, filteredCountQuery);

    if (allCount === filteredCount) {
        return context.localizeText('notes_x', [allCount]);
    } else {
        return context.localizeText('notes_x_x', [filteredCount, allCount]);
    }
}
