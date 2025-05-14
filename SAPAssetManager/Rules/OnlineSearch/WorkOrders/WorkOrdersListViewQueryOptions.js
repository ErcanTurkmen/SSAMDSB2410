import libCommon from '../../Common/Library/CommonLibrary';
import libSearch from '../OnlineSearchLibrary';

export default function WorkOrdersListViewQueryOptions(context) {
    const workOrdersTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const queryOptions = libCommon.getQueryOptionFromFilter(context);
    const promise = libCommon.isDefined(queryOptions) ?
        libSearch.setTabCaptionWithCountAndEnableSelect(context.getPageProxy(), 'WorkOrderHeaders', queryOptions, workOrdersTabName, 'work_order') :
        Promise.resolve();

    return promise.then(() => {
        return '';
    });
}
