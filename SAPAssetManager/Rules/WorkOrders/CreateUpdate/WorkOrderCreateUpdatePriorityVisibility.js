import WorkOrderCreateUpdatePrioritiesList from './WorkOrderCreateUpdatePrioritiesList';

/**
* Returns visibility value for Segmented and ListPicker controls
* @param {IClientAPI} context MDK context
*/
export default async function WorkOrderCreateUpdatePriorityVisibility(context) {
    const prioritiesList = await WorkOrderCreateUpdatePrioritiesList(context);
    //The maximum number of segments is 5 for iOS
    const isSegmentedControlVisible = prioritiesList.length <= 5;

    return context.getName() === 'PrioritySeg' ? isSegmentedControlVisible : !isSegmentedControlVisible;
}
