import libCommon from '../../Common/Library/CommonLibrary';

export default function MileageAddEditPageOnUnloaded(context) {
    libCommon.removeStateVariable(context, 'addMileageCheckOnlyUnsavedChangesOnCancel');
}
