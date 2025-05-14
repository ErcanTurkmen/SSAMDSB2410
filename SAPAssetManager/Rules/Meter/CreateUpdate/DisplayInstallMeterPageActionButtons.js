import IsRevertButtonVisible from './IsRevertButtonVisible';

export default function DisplayInstallMeterPageActionButtons(context) {
    if (IsRevertButtonVisible(context.getPageProxy())) {
        context.getPageProxy().setActionBarItemVisible('RevertMeterButton', true);
    }
    context.getPageProxy().setActionBarItemVisible('SubmitMeterButton', true);
}
