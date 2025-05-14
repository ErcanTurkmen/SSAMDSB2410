
export default function HideInstallMeterPageActionButtons(context) {
    context.getPageProxy().setActionBarItemVisible('RevertMeterButton', false);
    context.getPageProxy().setActionBarItemVisible('SubmitMeterButton', false);
}
