import notification from '../../NotificationLibrary';

export default function NotificationItemDetailsPartGroup(context) {
    try	{
        const objectPartCodeGroup = context.binding.ObjectPartCodeGroup;
        return notification.NotificationCodeGroupStr(context, 'CatTypeObjectParts', objectPartCodeGroup);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
