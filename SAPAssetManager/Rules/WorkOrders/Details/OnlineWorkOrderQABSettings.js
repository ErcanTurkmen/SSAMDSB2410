import QABSettings from '../../QAB/QABSettings';
import EnableWorkOrderCreateFromWorkOrder from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreateFromWorkOrder';
import { showAssignDependingOnAssignmentType } from '../../OnlineSearch/WorkOrders/AccessoryButtonIcon';
import EnableNotificationCreateFromWorkOrder from '../../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';

export default class OnlineWorkOrderQABSettings extends QABSettings {
    async generateChips() {
        let chips = [];
        if (this._context?.binding['@odata.type'] === '#sap_mobile.WorkOrderHeader') {
            chips = [
                await this._createAddWorkOrderChip(),
                await this._createAddNotificationChip(),
                await this._createAssignChip(),
            ];
        } else {
            chips = [
                await this._createAssignChip(),
            ];
        }
        return super.generateChips(chips);
    }


    async _createAddWorkOrderChip(props = {}) {
        return super._createAddWorkOrderChip({
            ...{
                'Label': this._context.localizeText('add_order'),
                'IsButtonEnabled': await EnableWorkOrderCreateFromWorkOrder(this._context),
                'Action': '/SAPAssetManager/Rules/WorkOrders/FollowUpWorkOrderCreateNav.js',
            },
            ...props,
        });
    }

    async _createAddNotificationChip() {
        return super._createAddNotificationChip({
            'Label': this._context.localizeText('add_notification'),
            'IsButtonEnabled': await EnableNotificationCreateFromWorkOrder(this._context),
            'Action': '/SAPAssetManager/Rules/WorkOrders/WorkOrderNotificationCreateNav.js',
        });
    }

    async _createAssignChip(props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('assign'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAssign.png,/SAPAssetManager/Images/QABAssign.android.png)',
                'Action': '/SAPAssetManager/Rules/OnlineSearch/Download/DownloadToDevice.js',
                '_Name': 'ASSIGN_WO',
                'IsButtonEnabled': await showAssignDependingOnAssignmentType(this._context),
            }, ...props,
        });
    }
}
