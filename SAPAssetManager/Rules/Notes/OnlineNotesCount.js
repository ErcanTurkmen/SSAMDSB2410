import { NoteLibrary as NoteLib} from './NoteLibrary';
import LibVal from '../Common/Library/ValidationLibrary';
import CommonLib from '../Common/Library/CommonLibrary';

export default function OnlineNotesCount(context) {
    let page = CommonLib.getPageName(context);
    let readLink = context.getPageProxy().binding['@odata.readLink'];

    let noteComponent = NoteLib.getNoteComponentForPage(context, page);
    if (noteComponent) {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', readLink + '/' + noteComponent, [], '').then((result) => {
            if (result && result.getItem(0)) {
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
