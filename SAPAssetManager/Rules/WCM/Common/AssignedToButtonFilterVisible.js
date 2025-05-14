import CommonLibrary from '../../Common/Library/CommonLibrary';

/** @param {IFormCellProxy} context  */
export default function AssignedToButtonFilterVisible(context) {
    const isListPkrVisible = CommonLibrary.getAppParam(context, 'WCM', 'ShowAssignedToList') === 'Y';
    return !isListPkrVisible;
}
