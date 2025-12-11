import PriorityListPicker from '../../../../SAPAssetManager/Rules/Notifications/PriorityListPicker';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
/**
* Set visibility of priority segmented control/list picker based on OS and priority count
* A special thanks to Global Design for this mandate.
* @param {IFormCellProxy} context control context
*/
export default async function NotificationCreateUpdatePriorityVisibility(context) {
  var onCreate = libCom.IsOnCreate(context);
  let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
  if (!onCreate && !isLocal) {
    const prioritiesList = await PriorityListPicker(context);
    //The maximum number of segments is 5 for iOS
    const isSegmentedControlVisible = prioritiesList.length <= 5;
    return context.getName() === 'PrioritySeg' ? isSegmentedControlVisible : !isSegmentedControlVisible;
  }
  else {
    return false;
  }
}
