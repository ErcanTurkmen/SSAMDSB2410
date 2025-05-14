import commonLib from '../Library/CommonLibrary';

export default function OnlineEquipFLocDetailsPageStatusesTable(context) {
    const userStatusesNavLink = context.binding?.UserStatus;
    const systemStatusesNavLink = context.binding?.SystemStatus;
    let userStatusesString = '-';
    let systemStatusesString = '-';

    if (commonLib.isDefined(userStatusesNavLink)) {
        const userStatuses = userStatusesNavLink.map(status => status.StatusText);
        userStatusesString = userStatuses.join(', ') || '-';
    }

    if (commonLib.isDefined(systemStatusesNavLink)) {
        const systemStatuses = systemStatusesNavLink.map(status => status.StatusText);
        systemStatusesString = systemStatuses.join(', ') || '-';
    }

    return {
        UserStatusText: userStatusesString,
        SystemStatusText: systemStatusesString,
    };
}
