import { NoteLibrary as NoteLib} from './NoteLibrary';
import LibVal from '../Common/Library/ValidationLibrary';
import NotesListLibrary from './List/NotesListLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function NotesCount(context) {
    let page = CommonLibrary.getPageName(context);
    let query = context.getPageProxy().binding['@odata.readLink'];
    if (page === 'MeasuringPointDetailsPage') {
        context._context.binding = context.getPageProxy().binding.WorkOrderTool[0];
        query = context.binding['@odata.readLink'];
    }
    let noteComponent = NoteLib.getNoteComponentForPage(context, page);
    if (noteComponent) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', query + '/' + noteComponent, [], '').then((result) => {
            if (result && result.getItem(0)) {
                if (NotesListLibrary.isListNote(context)) {
                    return result.length;
                }

                if (LibVal.evalIsEmpty(result.getItem(0).TextString)) {
                    return 0;
                }
                return 1;
            }
            return 0;
        }).catch(() => {
            return 0;
        });
    } 
    return 0;
}
