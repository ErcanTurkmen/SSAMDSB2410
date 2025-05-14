import IssueEnable from './IssueEnable';
import libCommon from '../../Common/Library/CommonLibrary';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import { WorkOrderDetailsPageName } from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';

export default function IssueEnableFromObjectCard(context) {
    const binding = context.getPageProxy().getActionBinding() || context.binding;

    if (!libCommon.isEntityLocal(binding) && binding.BackFlushIndicator !== 'X') {
        if (libCommon.getPageName(context) === WorkOrderDetailsPageName(context)) {
            return libWOStatus.isOrderComplete(context).then(status => {
                return status ? false : IssueEnable(context, binding);
            });
        }

        return IssueEnable(context, binding);
    }

    return false;
}
