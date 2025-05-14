import WorkOrdersListPopoverVisible from './WorkOrdersListPopoverVisible';

export default async function WorkOrderListViewFilterVisible(context) {
    // Since SupervisorWorkOrderAddPopover (controlled by WorkOrdersListPopoverVisible) has a filter item,
    // we have to make this invisible when IsSupervisorSectionVisibleForWO or IsOnlineSearchEnabled is enabled.
    return WorkOrdersListPopoverVisible(context).then(result => {
        return !result;
    });
}
