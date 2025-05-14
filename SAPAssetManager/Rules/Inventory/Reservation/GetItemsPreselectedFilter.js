import ReservationItemsFilterCaptionOpen from './ReservationItemsFilterCaptionOpen';
/**
* Rule to set default filter for Items
* @param {IClientAPI} context
*/
export default function GetComponentsPreselectedFilter(context) {

    let filterQuery = 'RequirementQuantity eq 0 or WithdrawalQuantity eq 0 or RequirementQuantity gt WithdrawalQuantity';
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenItems', [ReservationItemsFilterCaptionOpen(context)],[filterQuery], true)];
}
