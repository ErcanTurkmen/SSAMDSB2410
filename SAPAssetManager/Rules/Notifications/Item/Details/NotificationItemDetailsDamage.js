import notification from '../../NotificationLibrary';

export default function NotificationItemDetailsDamage(context) {
    try	{
        const codeGroup = context.binding.CodeGroup;
        const code = context.binding.DamageCode;
        return notification.NotificationCodeStr(context, 'CatTypeDefects', codeGroup, code);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
