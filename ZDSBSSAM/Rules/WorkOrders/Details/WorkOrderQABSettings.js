import QABSettings from '../../../../SAPAssetManager/Rules/QAB/QABSettings';
import libPersona from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import EnableWorkOrderCreateFromWorkOrder from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderCreateFromWorkOrder';
import EnableNotificationCreateFromWorkOrder from '../../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';
import IsGISEnabled from '../../../../SAPAssetManager/Rules/Maps/IsGISEnabled';
import IsViewMapButtonVisible from '../../../../SAPAssetManager/Rules/QAB/IsViewMapButtonVisible';
import EnableOperationCreate from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableOperationCreate';
import MeterSectionLibrary from '../../../../SAPAssetManager/Rules/Meter/Common/MeterSectionLibrary';
import IsMeterComponentEnabled from '../../../../SAPAssetManager/Rules/ComponentsEnablement/IsMeterComponentEnabled';
import EnableWorkOrderEdit from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import IsAddConfirmationButtonVisible from '../../../../SAPAssetManager/Rules/QAB/IsAddConfirmationButtonVisible';
import ConfirmationCreateIsEnabled from '../../../../SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';
import ZIsSO13WorkOrderType from '../ZIsSO13WorkOrderType';
import PartAddVisibility from '../../Parts/PartAddVisibility';
import zunassign from '../../OnlineSearch/Download/ZUnAssignToUser';

//DSB customisation to remove some QAB chips
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
                /*await this._createAddWorkOrderChip({
                    'IsEnabled': isMT,
                }),*/
                await this._createAddOperationChip({ 'IsButtonVisibleBySettings': !isMT }),
                this._createAddPartChip({
                    'IsButtonEnabled': enableWorkOrderEdit,
                    'IsButtonVisible': await PartAddVisibility(this._context),
                    'IsButtonVisibleBySettings': false,
                }),
               /* this._createAddNoteChip({
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
                this._createRecordTimeConfirmationChip(),*/
                await this._createUnAssignChip(),
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
                'IsButtonVisible':await ZIsSO13WorkOrderType(this._context),
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

    async _createUnAssignChip(props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('unassign'),
                'Icon': '$(PLT, /SAPAssetManager/Images/unassign.png, /SAPAssetManager/Images/unassign.android.png)',
                'Action': '/ZDSBSSAM/Rules/OnlineSearch/Download/ZUnAssignToUser.js',
                '_Name': 'UNASSIGN_WO',
                'IsButtonEnabled': true,
                'IsButtonVisibleBySettings': true,
                'IsButtonVisible': '/ZDSBSSAM/Rules/OnlineSearch/Download/ZEnableUnAssignToUser.js'
            }, ...props,
        });
    }
}
