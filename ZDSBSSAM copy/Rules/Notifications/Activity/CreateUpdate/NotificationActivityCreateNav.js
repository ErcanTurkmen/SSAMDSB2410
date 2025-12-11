import libCommon from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NotificationActivityCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    //DSB customisation - added context action binding to read from swipe button 
    if (context.constructor.name === 'SectionedTableProxy') {
        context.getPageProxy().setActionBinding(context.getPageProxy().getExecutedContextMenuItem().getBinding());
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityCreateUpdateNav.action');
}
