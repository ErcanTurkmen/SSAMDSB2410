import CommonLibrary from '../../Common/Library/CommonLibrary';

/** @param {IListPickerFormCellProxy} context  */
export default function AssignedToListFilterVisible(context) {
    const isListPkrVisible = CommonLibrary.getAppParam(context, 'WCM', 'ShowAssignedToList') === 'Y';
    return isListPkrVisible;
}
