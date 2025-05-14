
export default function DatePickerVisibleSwitchChanged(context, visibilitySwitchName) {
    let controls = '';
    switch (visibilitySwitchName) {
        case 'ValidFromFilterVisibleSwitch':
            controls = ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'];
            break;
        case 'ValidToFilterVisibleSwitch':
            controls = ['ValidToDatePickerStart', 'ValidToDatePickerEnd'];
            break;
        default:
            break;
    }
    const fcContainer = context.getPageProxy().getControl('FormCellContainer');
    const isVisible = fcContainer.getControl(visibilitySwitchName).getValue();
    controls.forEach(controlName => SetVisibility(isVisible, fcContainer.getControl(controlName)));
    return isVisible;
}

function SetVisibility(isVisible, datePicker) {
    datePicker.setVisible(isVisible);
    datePicker.redraw();
}
