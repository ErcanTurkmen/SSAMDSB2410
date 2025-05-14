
export default function OnFinalValueChanged(control) {
    let isFinal = control.getValue();

    if (isFinal) {
        control.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationConfirmFinalMessage.action').then(result => {
            if (!result.data) {
                control.setValue(false);
            }
        });
    }
}
