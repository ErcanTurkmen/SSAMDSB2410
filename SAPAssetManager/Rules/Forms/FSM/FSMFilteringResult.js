import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function FSMFilteringResult(context) {
    let result1 = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:SortFilter/#Value');
    let filterResults = [result1];
    let pageProxy = context.getPageProxy();
    let s4 = IsS4ServiceIntegrationEnabled(context);
    let prefix = (s4) ? 'S4' : '';
    let woListPickerProxy = libCom.getControlProxy(pageProxy, prefix + 'WorkOrderFilter');
    let woSelection = woListPickerProxy.getValue()[0] ? woListPickerProxy.getValue()[0].ReturnValue : '';
    let opListPickerProxy = libCom.getControlProxy(pageProxy, prefix + 'OperationFilter');
    let opSelection = opListPickerProxy.getValue()[0] ? opListPickerProxy.getValue()[0].ReturnValue : '';
    let result2 = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:FSMTypeFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:FSMStatusFilter/#Value');

    if (!libEval.evalIsEmpty(woSelection)) {
        let woFilter = ["WorkOrder eq '" + woSelection + "'"];
        if (s4) woFilter = ["S4ServiceOrderId eq '" + woSelection + "'"];
        let woFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, woFilter, true, undefined, [woSelection]);
        filterResults.push(woFilterResult);
    }
    if (!libEval.evalIsEmpty(opSelection)) {
        let opFilter = ["Operation eq '" + opSelection + "'"];
        if (s4) opFilter = ["S4ServiceItemNumber eq '" + opSelection + "'"];
        let opFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, opFilter, true, undefined, [opSelection]);
        filterResults.push(opFilterResult);
    }
    filterResults.push(result2);
    filterResults.push(result3);

    return filterResults;
}
