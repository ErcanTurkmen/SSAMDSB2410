import libCommon from '../../Common/Library/CommonLibrary';
import MileageAddNav from './MileageAddNav';

export default function MileageAddNavCheckOnlyUnsavedChanges(context) {
    libCommon.setStateVariable(context, 'addMileageCheckOnlyUnsavedChangesOnCancel', true);
    MileageAddNav(context);
}
