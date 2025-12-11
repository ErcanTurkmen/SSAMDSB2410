import QABSettings from '../../../SAPAssetManager/Rules/QAB/QABSettings';
import EnableNotificationCreate from '../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreate';
import IsPhaseModelEnabled from '../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import EnableNotificationCreateFromWorkOrderOperation from '../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrderOperation';
import IsAddConfirmationButtonVisible from '../../../SAPAssetManager/Rules/QAB/IsAddConfirmationButtonVisible';
import libPersona from '../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import IsMeterComponentEnabled from '../../../SAPAssetManager/Rules/ComponentsEnablement/IsMeterComponentEnabled';
import MeterSectionLibrary from '../../../SAPAssetManager/Rules/Meter/Common/MeterSectionLibrary';
import EnableSubOperation from '../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableSubOperation';
import EnableWorkOrderEdit from '../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import ConfirmationsIsEnabled from '../../../SAPAssetManager/Rules/Confirmations/ConfirmationsIsEnabled';
import DocumentAddFromOperationDetails from '../../../SAPAssetManager/Rules//Documents/DocumentAddFromOperationDetails';
import IsAddConfirmationButtonVisibleOnOperationDetails from '../../../SAPAssetManager/Rules/QAB/IsAddConfirmationButtonVisibleOnOperationDetails';
import ZCheckOperationNotificationExists from '../WorkOrders/Operations/ZCheckOperationNotificationExists';
import ZPartAddVisibilityFromOpr from '../Parts/ZPartAddVisibilityFromOpr';
import ZPartAdhocIssueVisible from '../Parts/Issue/ZPartAdhocIssueVisible';

export default class WorkOrderOperationQABSettings extends QABSettings {
    async generateChips() {
        const isEnabledWorkorderEdit = await EnableWorkOrderEdit(this._context);

        const chips = [
            //await this._addSubOperationChip(),
            this._createAddNotificationChip({
                'Label': this._context.localizeText('add_notification'),
                'IsEnabled': EnableNotificationCreate(this._context) && !IsPhaseModelEnabled(this._context),
                'IsButtonEnabled': await EnableNotificationCreateFromWorkOrderOperation(this._context),
                'IsButtonVisible': await ZCheckOperationNotificationExists(this._context),
                'Action': '/SAPAssetManager/Rules/Operations/WorkOrderOperationNotificationCreateNav.js',
                'IsButtonVisibleBySettings': true,
            }),
            await this._addMeterChip(),
            this._createAddPartChip({
                'IsButtonEnabled': isEnabledWorkorderEdit,
                'IsButtonVisible': await ZPartAddVisibilityFromOpr(this._context),
                'IsButtonVisibleBySettings': true,
                'Label': this._context.localizeText('add_part'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddPart.png,/SAPAssetManager/Images/QABAddPart.android.png)',
                'Action': '/SAPAssetManager/Rules/Parts/CreateUpdate/PartCreateNav.js',
                '_Name': 'ADD_PART',
            }),
            //DSB customisation to remove other chips
            /*this._createAddNoteChip({ IsButtonEnabled: isEnabledWorkorderEdit, IsButtonVisibleBySettings: false }),
            this._createAddServiceConfirmationChip({
                'Label': this._context.localizeText('add_service_confirmation'),
                'IsEnabled': ConfirmationsIsEnabled(this._context),
                'IsButtonEnabled': (await IsAddConfirmationButtonVisibleOnOperationDetails(this._context)) && libPersona.isMaintenanceTechnician(this._context) && IsAddConfirmationButtonVisible(this._context),
                'Action': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateFromOperation.js',
            }),
            await this._createTakeReadingsChip(),
            this._createAddAttachmentChip({
                'IsButtonEnabled': await DocumentAddFromOperationDetails(this._context),
                '_Name': 'ADD_ATTACHMENT_QAB',
            }),
            await this._createAddMileageChip({ IsButtonVisibleBySettings: true }),
            await this._createAddExpenseChip({ IsButtonVisibleBySettings: true }),
            await this._createDownloadDocumentsChip(),*/
        ];
        //DSB customization to add zAdhoc_issue_part
        const issue_retun_part_enabled = await ZPartAdhocIssueVisible(this._context);
        if (issue_retun_part_enabled) {
            chips.push(this._createChip({
                'IsButtonEnabled': isEnabledWorkorderEdit,
                'IsButtonVisible': await ZPartAdhocIssueVisible(this._context),
                'IsButtonVisibleBySettings': true,
                'Label': this._context.localizeText('zAdhoc_issue_part'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddPart.png,/SAPAssetManager/Images/QABAddPart.android.png)',
                'Action': '/ZDSBSSAM/Actions/Parts/ZPartAdhocIssueCreateChangeset.action',
                '_Name': 'ISSUE_PART',
            })
            );
            //DSB customization to add zAdhoc_return_part
            chips.push(this._createChip({
                'IsButtonEnabled': isEnabledWorkorderEdit,
                'IsButtonVisible': await ZPartAdhocIssueVisible(this._context),
                'IsButtonVisibleBySettings': true,
                'Label': this._context.localizeText('zAdhoc_return_part'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddPart.png,/SAPAssetManager/Images/QABAddPart.android.png)',
                'Action': '/ZDSBSSAM/Actions/Parts/ZPartAdhocReturnCreateChangeset.action',
                '_Name': 'RETURN_PART',
            }));
        }
        return super.generateChips(chips);
    }

    async _addSubOperationChip() {
        return this._createChip({
            'Label': this._context.localizeText('add_suboperation'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddSubOperation.ios.png,/SAPAssetManager/Images/QABAddSubOperation.android.png)',
            'IsButtonEnabled': await EnableSubOperation(this._context),
            'IsButtonVisibleBySettings': false,
            'Action': '/SAPAssetManager/Rules/SubOperations/CreateUpdate/SubOperationCreateNav.js',
            '_Name': 'ADD_SUBOPERATION_QAB',
        });
    }

    async _addMeterChip() {
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
}
