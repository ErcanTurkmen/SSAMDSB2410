import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

const ServiceQuotationsFilterSwitchMapping = {
    ValidFromFilterVisibleSwitch: ['QuotationStartDateTimeStart', 'QuotationStartDateTimeEnd'],
    ValidToFilterVisibleSwitch: ['QuotationEndDateTimeStart', 'QuotationEndDateTimeEnd'],
};

export default function ServiceQuotationsSwitchFilterChanged(context) {
    RedrawFilterToolbar(context);
    
    const fc = context.getPageProxy().getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const isVisible = context.getValue();
    (ServiceQuotationsFilterSwitchMapping[context.getName()] || []).forEach(n => fc.getControl(n).setVisible(isVisible));
}

