import PriorityOptions from './PriorityOptions';
/**
* @param {IFormCellProxy} context control context
*/
export default async function PrioritySegmentVisibility(context) {
 const prioritiesList = await PriorityOptions(context);
  const isSegmentedControlVisible = prioritiesList.length <= 5;
  return context.getName() === 'PriorityFilter' ? isSegmentedControlVisible : !isSegmentedControlVisible;
}
