import Logger from '../../Log/Logger';

export default function NotificationCreateUpdateShowFieldsChange(context, interceptValue) {
    let toggle = false;

    if (interceptValue === undefined && context.getValue() === true) {
        toggle = true;
    } else if (interceptValue !== undefined) {
        toggle = interceptValue;
    }
    try {
        context.getPageProxy().getControl('FormCellContainer').getSection('CauseSetupSection').setVisible(toggle);
        context.getPageProxy().getControl('FormCellContainer').getSection('FormCellSection4').setVisible(toggle);
    } catch (err) {
        Logger.error('updateNotificationCreateUpdateSectionsVisibility', err);
    }
}
