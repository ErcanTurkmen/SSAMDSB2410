import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function FollowOnWorkOrderListViewFilter(context) {
    libCommon.setStateVariable(context, 'WORKORDER_FILTER',libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter);
}
