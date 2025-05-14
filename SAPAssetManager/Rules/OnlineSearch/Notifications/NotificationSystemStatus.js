//original translations that are comming from backend are too long for android phone
const mapCodeWithTranslation = {
    'OSNO': 'outstanding_notifications', 
    'NOCO': 'completed', 
    'NOPR': 'sdf_status_in_process', 
    'NOPO': 'postponed', 
    'OSTS': 'outstanding_tasts_exist', 
    'ORAS': 'order_assigned', 
    'APOK': 'approval_ok', 
    'APRQ': 'approval_required_notification',
};

export default function NotificationSystemStatus(context) {
    const binding = context.binding;

    if (binding) {
        const sysStatuses = binding.SystemStatus.split(' ');
        const sysStatusCode = sysStatuses[0];
        const searchSystemStatus = getSearchSystemStatus(context, sysStatuses, sysStatusCode);
        const shortStatus = context.localizeText(mapCodeWithTranslation[sysStatusCode]) ?? binding.SystemStatusDesc;
        const concatTwoStatuses = searchSystemStatus ? `${searchSystemStatus}, ${shortStatus}` : shortStatus;
        return concatTwoStatuses;
    }
    return '';
}

function getSearchSystemStatus(context, sysStatuses, sysStatusCode) {
    const clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    let sameSysCodes = [];
    if (clientData.NotificationSystemStatusFilter) {
        sameSysCodes = clientData.NotificationSystemStatusFilter?.filterItems.filter((code) => { 
            return sysStatuses.indexOf(code) !== -1; 
        });
    } else {
        return null;
    }
    let resultStatus = null;
    if (sameSysCodes.length && !sameSysCodes.includes(sysStatusCode)) {
        const shortStatus = mapCodeWithTranslation[sameSysCodes[0]];
        resultStatus = shortStatus ? context.localizeText(shortStatus) : findDisplayValue(clientData, sysStatuses, sameSysCodes[0]);
    }
    return sameSysCodes[0] === sysStatusCode ? null : resultStatus;
}

function findDisplayValue(clientData, sysStatuses, code) {
    const index = sysStatuses.findIndex(code);
    return clientData.filterItemsDisplayValue[index];
}
