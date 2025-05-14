import PriorityListPicker from '../PriorityListPicker';
/**
* Set visibility of priority segmented control/list picker based on OS and priority count
* A special thanks to Global Design for this mandate.
* @param {IFormCellProxy} context control context
*/
export default async function NotificationCreateUpdatePriorityVisibility(context) {
 const prioritiesList = await PriorityListPicker(context);
  //The maximum number of segments is 5 for iOS
  const isSegmentedControlVisible = prioritiesList.length <= 5;
  return context.getName() === 'PrioritySeg' ? isSegmentedControlVisible : !isSegmentedControlVisible;
}
