import libCom from '../../Common/Library/CommonLibrary';
import WCMNotesLibrary from './WCMNotesLibrary';

export default async function WCMAddNotePageOnLoaded(context) {
    const types = await WCMNotesLibrary.getListNoteTypesAllowedForCreationByObjectType(context);
    context.getControls()[0].getControls()[0].setValue(types[0]);
    libCom.saveInitialValues(context);
}
