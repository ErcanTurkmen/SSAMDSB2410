import notification from '../NotificationLibrary';

export default function NotificationCauseDetailsCode(context) {
    try	{
        const code = context.binding.CauseCode;
        const codeGroup = context.binding.CauseCodeGroup;
        return notification.NotificationCodeStr(context, 'CatTypeCauses', codeGroup, code);
    } catch (exception)	{
        return 'Unknown';
    }
}
