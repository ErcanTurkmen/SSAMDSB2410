import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import FilterLibrary from '../../../../Filter/FilterLibrary';

export default function MeasuringPointsEDTFiltersReset(context) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;
    filters.active = {};
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters = filters;

    FilterLibrary.setDefaultFilter(context.getPageProxy(), true);
    let prtControl = CommonLibrary.getControlProxy(context.getPageProxy(), 'FilterPRT');
    prtControl.setValue(false);
}
