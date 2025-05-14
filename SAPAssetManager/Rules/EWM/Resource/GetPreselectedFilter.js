/**
* Describe this function...
* @param {IClientAPI} context
*/
import ResourceAvailableCaption from './ResourceAvailableCaption';
export default function GetPreselectedFilter(context) {
    const ResourceAvailableFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'AvailableResource', [ResourceAvailableCaption(context)], ["User eq ''"], true);
    //Default select not counted filter
    const filters = [ ResourceAvailableFilter ];

    return filters;
}
