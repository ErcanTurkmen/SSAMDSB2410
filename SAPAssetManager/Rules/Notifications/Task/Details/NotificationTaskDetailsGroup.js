import notification from '../../NotificationLibrary';

export default function NotificationTaskDetailsGroup(context) {
    try	{
        const codeGroup = context.binding.TaskCodeGroup;
        return notification.NotificationCodeGroupStr(context, 'CatTypeTasks', codeGroup);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
