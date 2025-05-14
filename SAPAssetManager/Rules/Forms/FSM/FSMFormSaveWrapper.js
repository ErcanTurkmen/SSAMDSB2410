import libCom from '../../Common/Library/CommonLibrary';
import FSMFormSave from './FSMFormSave';
import FSMFormSaveWindows from './FSMFormSaveWindows';
import isWindows from '../../Common/IsWindows';

export default function FSMFormSaveWrapper(context) {
    libCom.setStateVariable(context, 'FSMClosedFlag', false); //Set the closed flag for updating instance to backend
    libCom.setStateVariable(context, 'FSMToastMessage', context.localizeText('forms_draft_toast'));
    return isWindows(context) ? FSMFormSaveWindows(context) : FSMFormSave(context);
}
