import CommonLibrary from '../../Common/Library/CommonLibrary';
import TechnicalObjectCreateUpdateValidation from '../../Common/Validation/TechnicalObjectCreateUpdateValidation';
import DocumentLibrary from '../../Documents/DocumentLibrary';
import ValidateActualWorkValue from '../../Expense/CreateUpdate/ValidateActualWorkValue';
import NoteTypeControlLibrary from '../../Notes/Create/NoteTypeControlLibrary';

export default function ServiceItemValidationRule(context) {
    let valPromises = [];

    // check attachment count, run the validation rule if there is an attachment
    if (DocumentLibrary.attachmentSectionHasData(context)) {
        valPromises.push(DocumentLibrary.createValidationRule(context));
    }

    // check note, run the note type validation rule if there is an value
    if (NoteTypeControlLibrary.noteSectionHasValue(context)) {
        valPromises.push(NoteTypeControlLibrary.validateNoteTypeControl(context));
    }

    valPromises.push(
        TechnicalObjectCreateUpdateValidation(context).then(() => {
            const amountControl = CommonLibrary.getControlProxy(context, 'AmountProperty');
            return ValidateActualWorkValue(context, amountControl, 15);
        }),
    );

    return Promise.all(valPromises).then((results) => {
        const pass = results.reduce((total, value) => {
            return total && value;
        });
        if (!pass) {
            throw new Error();
        }
        return true;
    }).catch(() => {
        return false;
    });
}
