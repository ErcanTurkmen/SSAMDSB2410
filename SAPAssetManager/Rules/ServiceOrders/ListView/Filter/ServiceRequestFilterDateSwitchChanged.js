import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

/** @param {IFormCellProxy} context */
export default function ServiceRequestFilterDateSwitchChanged(context) {
    RedrawFilterToolbar(context);
    
    const fc = context.getPageProxy().getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const isVisible = context.getValue();
    (ServiceRequestFilterSwitchMapping[context.getName()] || []).forEach(n => fc.getControl(n).setVisible(isVisible));
}


const ServiceRequestFilterSwitchMapping = Object.freeze({
    DueDateSwitch: ['DueStartDateFilter', 'DueEndDateFilter'],
    RequestStartDateSwitch: ['ReqStartDateFilter', 'ReqEndDateFilter'],
});
