import { NoteLibrary } from '../../Notes/NoteLibrary';
import { ValueIfExists } from '../../Common/Library/Formatter';
import WCMNotesLibrary from './WCMNotesLibrary';


export default function WCMNoteSectionValue(context, name) {
    const sectionName = name || context.getName();
    const filter = WCMNotesLibrary.getNoteQueryOptions(context, sectionName);
    const entitySet = WCMNotesLibrary.getNotesEntitySet(context.getPageProxy());

    return NoteLibrary.noteDownloadValue(context, entitySet, filter).then(result => {
        return ValueIfExists(result);
    });
}
