import IsAndroid from '../../Common/IsAndroid';
import libSubOpMobile from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import WorkOrderSubOperationListViewCaption from './CreateUpdate/WorkOrderSubOperationListViewCaption';
import { prepareDataForSubOperationFastFilters } from './SubOperationFastFiltersItems';

export default function SubOperationListViewOnReturning(context) {
    return libSubOpMobile.isAnySubOperationStarted(context).then(() => {
        const SubOperationFastFiltersClass = context.getPageProxy().getClientData().SubOperationFastFiltersClass;
        return refreshFilterFeedbackBar(context, SubOperationFastFiltersClass).then(() => {
            return WorkOrderSubOperationListViewCaption(context);
        });
    });
}

function refreshFilterFeedbackBar(context, SubOperationFastFiltersClass) {
    const sectionedTable = context.getControls()[0];
    const confirmedFilterString = SubOperationFastFiltersClass._getConfirmedFilterItemReturnValue();
    const unconfirmedFilterString = SubOperationFastFiltersClass._getUnconfirmedFilterItemReturnValue();

    let appliedFilters = sectionedTable.filters;
    let indexFilterByUnconfirm = [-1, -1];
    let indexFilterByConfirm = [-1, -1];

    // Android updates the filters feedback bar when the page is returned
    // Filtering should be done by the displayed filter value
    if (IsAndroid(context)) {
        appliedFilters.forEach((filter, filterIndex) => {
            filter.filterItemsDisplayValue.forEach((label, itemIndex) => {
                if (label === context.localizeText('unconfirmed_filter')) {
                    indexFilterByUnconfirm = [filterIndex, itemIndex];
                }

                if (label === context.localizeText('confirmed_filter')) {
                    indexFilterByConfirm = [filterIndex, itemIndex];
                }
            });
        });
    } else {
        appliedFilters.forEach((filter, filterIndex) => {
            filter.filterItems.forEach((item, itemIndex) => {
                if (item === unconfirmedFilterString) {
                    indexFilterByUnconfirm = [filterIndex, itemIndex];
                }

                if (item === confirmedFilterString) {
                    indexFilterByConfirm = [filterIndex, itemIndex];
                }
            });
        });
    }

    if (indexFilterByUnconfirm[0] !== -1 || indexFilterByConfirm[0] !== -1) {
        return prepareDataForSubOperationFastFilters(context, SubOperationFastFiltersClass).then(() => {
            if (indexFilterByUnconfirm[0] !== -1) {
                let refreshedUnconfirmedFilterString = SubOperationFastFiltersClass._getUnconfirmedFilterItemReturnValue();
                appliedFilters[indexFilterByUnconfirm[0]].filterItems[indexFilterByUnconfirm[1]] = refreshedUnconfirmedFilterString;
            }
            
            if (indexFilterByConfirm[0] !== -1) {
                let refreshedConfirmedFilterString = SubOperationFastFiltersClass._getConfirmedFilterItemReturnValue();
                appliedFilters[indexFilterByConfirm[0]].filterItems[indexFilterByConfirm[1]] = refreshedConfirmedFilterString;
            }
           
            return SubOperationFastFiltersClass.updateFilterFeedbackBar(sectionedTable, appliedFilters);
        });
    }

    return Promise.resolve();
}
