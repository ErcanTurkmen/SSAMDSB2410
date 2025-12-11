import QABSettings from '../../../../SAPAssetManager/Rules/QAB/QABSettings';
import IsGISEnabled from '../../../../SAPAssetManager/Rules/Maps/IsGISEnabled';
import IsViewMapButtonVisible from '../../../../SAPAssetManager/Rules/QAB/IsViewMapButtonVisible';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import NotificationsListGetTypesQueryOption from '../../../../SAPAssetManager/Rules/Notifications/ListView/NotificationsListGetTypesQueryOption';
import EnableNotificationCreateEdit from '../../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreateEdit';
import EnableNotificationTaskCreate from '../../../../SAPAssetManager/Rules/Notifications/Task/CreateUpdate/EnableNotificationTaskCreate';
import MeasuringPointsTakeReadingsIsVisible from '../../../../SAPAssetManager/Rules/Measurements/Points/MeasuringPointsTakeReadingsIsVisible';

export default class NotificationQABSettings extends QABSettings {
  async generateChips() {
    let isEditEnabled = libCom.getAppParam(this._context, 'USER_AUTHORIZATIONS', 'Enable.NO.Edit') === 'Y';

    if (!isEditEnabled) {
        const filterByType = await NotificationsListGetTypesQueryOption(this._context);
        const localNotificationsCount = await libCom.getEntitySetCount(this._context, 'MyNotificationHeaders', `$filter=sap.islocal()${filterByType ? ' and ' + filterByType : ''}`);
        isEditEnabled = localNotificationsCount > 0;
    }

    const isCreateEditEnabled = await EnableNotificationCreateEdit(this._context);

    const chips = [
        /*this._createChip({
            'Label': this._context.localizeText('add_item'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddItem.png,/SAPAssetManager/Images/QABAddItem.android.png)',
            'IsEnabled': isEditEnabled,
            'IsButtonEnabled': isCreateEditEnabled,
            'IsButtonVisible': false,
            'Action': '/SAPAssetManager/Rules/Notifications/Item/CreateUpdate/NotificationItemCreateNav.js',
            '_Name': 'ADD_ITEM',
        }),*/
        this._createChip({
            'Label': this._context.localizeText('add_task'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddTask.png,/SAPAssetManager/Images/QABAddTask.android.png)',
            'IsEnabled': isEditEnabled,
            'IsButtonEnabled': isCreateEditEnabled && EnableNotificationTaskCreate(this._context),
            'IsButtonVisible': isEditEnabled,
            'Action': '/SAPAssetManager/Rules/Notifications/Task/CreateUpdate/NotificationTaskCreateNav.js',
            '_Name': 'ADD_TASK',
        }),
        this._createChip({
            'Label': this._context.localizeText('add_activity'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddActivity.png,/SAPAssetManager/Images/QABAddActivity.android.png)',
            'IsEnabled': isEditEnabled,
            'IsButtonEnabled': isCreateEditEnabled,
            'IsButtonVisible': isEditEnabled,
            'Action': '/SAPAssetManager/Rules/Notifications/Activity/CreateUpdate/NotificationActivityCreateNav.js',
            '_Name': 'ADD_ACTIVITY',
        }),
        await this._createDownloadDocumentsChip(),
        this._createViewMapChip({
            'IsEnabled': IsGISEnabled(this._context),
            'IsButtonEnabled': await IsViewMapButtonVisible(this._context),
            'IsButtonVisible': IsGISEnabled(this._context),
            'Action': '/SAPAssetManager/Rules/Notifications/NotificationMapNav.js',
        }),
        //await this._createTakeReadingsChip(),
        this._createAddNoteChip({
            'IsButtonEnabled': isCreateEditEnabled,
            'IsButtonVisibleBySettings': false,
        }),
       /* this._createAddReminderChip({
            'IsButtonEnabled': isCreateEditEnabled,
            'IsButtonVisibleBySettings': false,
        }),
        this._createViewRelatedOrdersListChip(),*/
    ];

    return super.generateChips(chips);
  }

  async _createTakeReadingsChip() {
    return super._createTakeReadingsChip({
        'IsButtonVisible': await MeasuringPointsTakeReadingsIsVisible(this._context),
    });
}
}
