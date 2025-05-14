import CommonLibrary from '../../Common/Library/CommonLibrary';
import FormCellNoteValidation from '../../Common/Validation/FormCellNoteValidation';

export default function OnS4NoteValueChange(control) {
    FormCellNoteValidation(control);

    const pageProxy = control.getPageProxy();
    const noteTypeControl = CommonLibrary.getControlProxy(pageProxy, 'ServiceNoteTypesListPicker');
    if (control.getValue()) {
        noteTypeControl.setCaption(pageProxy.localizeText('note_type') + '*');
    } else {
        noteTypeControl.setCaption(pageProxy.localizeText('note_type'));
    }
}
