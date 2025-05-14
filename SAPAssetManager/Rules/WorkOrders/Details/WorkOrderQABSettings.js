import QABSettings from '../../QAB/QABSettings';
import libPersona from '../../Persona/PersonaLibrary';
import EnableWorkOrderCreateFromWorkOrder from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreateFromWorkOrder';
import EnableNotificationCreateFromWorkOrder from '../../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';
import IsGISEnabled from '../../Maps/IsGISEnabled';
import IsViewMapButtonVisible from '../../QAB/IsViewMapButtonVisible';
import EnableOperationCreate from '../../UserAuthorizations/WorkOrders/EnableOperationCreate';
import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';
import EnableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import IsAddConfirmationButtonVisible from '../../QAB/IsAddConfirmationButtonVisible';
import ConfirmationCreateIsEnabled from '../../Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';

export default class WorkOrderQABSettings extends QABSettings {
    async generateChips() {
        let chips = [];
        if (libPersona.isWCMOperator(this._context)) {
            chips = [
                this._createAddNotificationChipWCMDetailsPage(),
                await this._createDownloadDocumentsChip(),
            ];
        } else {
            const isMT = libPersona.isMaintenanceTechnician(this._context);
            const enableWorkOrderEdit = await EnableWorkOrderEdit(this._context);

            chips = [
                await this._createMeterActionChip(),
                await this._createAddWorkOrderChip({
                    'IsEnabled': isMT,
                }),
                await this._createAddOperationChip({ 'IsButtonVisibleBySettings': !isMT }),
                this._createAddPartChip({
                    'IsButtonEnabled': enableWorkOrderEdit,
                    'IsButtonVisibleBySettings': false,
                }),
                this._createAddNoteChip({
                    'IsButtonEnabled': enableWorkOrderEdit,
                    'IsButtonVisibleBySettings': false,
                }),
                await this._createAddNotificationChip(),
                this._createAddReminderChip({
                    'IsButtonEnabled': enableWorkOrderEdit,
                    'IsButtonVisibleBySettings': false,
                }),
                await this._createTakeReadingsChip(),
                await this._createDownloadDocumentsChip(),
                await this._createViewMapChip(),
                await this._createAddExpenseChip(),
                await this._createAddMileageChip(),
                this._createRecordTimeConfirmationChip(),
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

    async _createViewMapChip() {
        return super._createViewMapChip({
            'IsEnabled': IsGISEnabled(this._context),
            'Action': '/SAPAssetManager/Rules/WorkOrders/WorkOrderMapNav.js',
            'IsButtonEnabled': await IsViewMapButtonVisible(this._context),
            'IsButtonVisible': IsGISEnabled(this._context),
        });
    }

    async _createAddOperationChip(props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_operation'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddOperation.png,/SAPAssetManager/Images/QABAddOperation.android.png)',
                'IsButtonEnabled': await EnableOperationCreate(this._context),
                'Action': '/SAPAssetManager/Rules/WorkOrders/Operations/CreateUpdate/WorkOrderOperationCreateNav.js',
                '_Name': 'CREATE_OPERATION',
            }, ...props,
        });
    }

    async _createMeterActionChip() {
        const meterEnabled = IsMeterComponentEnabled(this._context);

        return this._createChip({
            'Label': meterEnabled ? await MeterSectionLibrary.quickActionTargetValues(this._context, 'Label') : '',
            'Icon': meterEnabled ? await MeterSectionLibrary.quickActionTargetValues(this._context, 'Icon') : '',
            'IsEnabled': meterEnabled && await MeterSectionLibrary.newObjectCellSectionVisible(this._context, 'QAB'),
            'IsButtonVisibleBySettings': false,
            'Action': meterEnabled ? await MeterSectionLibrary.quickActionTargetValues(this._context, 'Action') : '',
            '_Name': 'METER_QAB_ACTION',
        });
    }

    _createRecordTimeConfirmationChip() {
        const isConfirmationEnabled = IsAddConfirmationButtonVisible(this._context);
        const canCreateConfirmationForWO = ConfirmationCreateIsEnabled(this._context);

        return super._createRecordTimeChip({
            'Label': this._context.localizeText('confirmation_create_title'),
            'IsEnabled': isConfirmationEnabled,
            'IsButtonEnabled': canCreateConfirmationForWO,
            'IsButtonVisible': isConfirmationEnabled,
            'Action': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateFromWONav.js',
            '_Name': 'RECORD_TIME_CONFIRMATION',
        });
    }
}
