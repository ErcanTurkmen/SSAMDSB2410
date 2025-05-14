import notification from '../../NotificationLibrary';

export default function NotificationTaskDetailsCode(context) {
    try	{
        const code = context.binding.TaskCode;
        const codeGroup = context.binding.TaskCodeGroup;
        return notification.NotificationCodeStr(context, 'CatTypeTasks', codeGroup, code);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
