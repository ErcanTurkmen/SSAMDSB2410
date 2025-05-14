import DeleteEntitySuccessMessageNoClosePageWithAutoSave from '../../ApplicationEvents/AutoSync/actions/DeleteEntitySuccessMessageNoClosePageWithAutoSave';
import DeleteEntitySuccessMessageWithAutoSave from '../../ApplicationEvents/AutoSync/actions/DeleteEntitySuccessMessageWithAutoSave';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function OnDeleteNoteSuccess(context) {
    const currentPage = CommonLibrary.getPageName(context);
    if (['NotesListView', 'BPNotesListView', 'BusinessPartnerDetailsPage'].includes(currentPage)) {
        return DeleteEntitySuccessMessageNoClosePageWithAutoSave(context);
    }

    return DeleteEntitySuccessMessageWithAutoSave(context);
}
