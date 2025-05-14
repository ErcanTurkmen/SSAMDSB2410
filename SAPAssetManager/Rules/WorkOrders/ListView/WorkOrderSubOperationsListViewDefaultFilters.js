import libCom from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MyWorkSectionFilterQuery from '../../OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';

export default async function WorkOrderSubOperationsListViewDefaultFilters(context) {
    let filters = [];
    const { COMPLETED, STARTED, HOLD } = libMobile.getMobileStatusValueConstants(context);

    if (libCom.getStateVariable(context, 'KPI-InProgress')) {
        libCom.removeStateVariable(context, 'KPI-InProgress');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Started', undefined, [`(SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}' or SubOpMobileStatus_Nav/MobileStatus eq '${HOLD}')`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Open')) {
        libCom.removeStateVariable(context, 'KPI-Open');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', undefined, [`(SubOpMobileStatus_Nav/MobileStatus ne '${STARTED}' and SubOpMobileStatus_Nav/MobileStatus ne '${HOLD}' and SubOpMobileStatus_Nav/MobileStatus ne '${COMPLETED}')`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Completed')) {
        libCom.removeStateVariable(context, 'KPI-Completed');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Completed', undefined, [`SubOpMobileStatus_Nav/MobileStatus eq '${COMPLETED}'`], true));
    }
    let mySubOperationListView = libCom.getStateVariable(context, 'MySubOperationListView');
    if (mySubOperationListView === true) {
        const myWorkFilter = await MyWorkSectionFilterQuery(context, '');
        const filterDisplayValue = `${context.localizeText('assigned_to_me')} / ${context.localizeText('started')}`;
        return [context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [myWorkFilter], true, context.localizeText('my_work'), [filterDisplayValue])];
    }
    
    filters.push(context.createFilterCriteria(context.filterTypeEnum.Sorter, 'SubOperationNo', undefined, ['SubOperationNo'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('suboperation')]));

    return filters;
}
