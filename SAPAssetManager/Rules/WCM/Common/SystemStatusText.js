
export default function SystemStatusText(context) {
    return GetSystemStatusText(context, context.binding.ActualSystemStatus).then(statusText => {
        return statusText ? statusText : '-';
    });
}

export function GetSystemStatusText(context, actualStatus) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$select=StatusText&$filter=SystemStatus eq '${actualStatus}'`).then(wcmStatuses => {
        return wcmStatuses && wcmStatuses.length > 0 ? wcmStatuses.getItem(0).StatusText : undefined;
    });
}
