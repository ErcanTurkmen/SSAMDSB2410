import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FollowOnNotificationsCount(context) {
    let binding = (context.getPageProxy ? context.getPageProxy().binding : context.binding);
    if (context.constructor.name === 'SectionedTableProxy') {
        binding = CommonLibrary.getBindingObject(context);
    }
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return CommonLibrary.getEntitySetCount(context, 'MyNotificationHeaders', `$filter=RefObjectKey eq '${binding.OrderId}'`);
    } else {
        return 0;
    }
}
