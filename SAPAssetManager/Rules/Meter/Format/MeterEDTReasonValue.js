
export default function MeterEDTReasonValue(context) {
    if (context.binding?.Device_Nav?.ActivityReason) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'ActivityReasons', ['ActivityReason'], "$filter=PermitForRemoval eq 'X'")
            .then(result => {
                let reason = result.find(activity => activity.ActivityReason === context.binding.Device_Nav.ActivityReason);
                return reason ? context.binding.Device_Nav.ActivityReason : '';
            })
            .catch(() => {
                return Promise.resolve('');
            });
    }

    return Promise.resolve('');
}
