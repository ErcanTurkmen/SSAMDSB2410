import QABSettings from '../QAB/QABSettings';
import IsGISEnabled from '../Maps/IsGISEnabled';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import EnableConfirmationCreate from '../UserAuthorizations/Confirmations/EnableConfirmationCreate';

export default class OverviewQABSettings extends QABSettings {
    generateChips() {
        const chips = [
            this._createAddWorkOrderChip(),
            this._createAddNotificationChip(),
            this._createAddPurchaseRequisitionChip(),
            this._createRecordTimeTimesheetChip(),
            this._createRecordTimeConfirmationChip(),
            this._createViewMapChip(),
            this._onlineSearch(),
            this._createChipViewTaggingList(),
            this._createChipViewUntaggingList(),
        ];

        return super.generateChips(chips);
    }

    _createViewMapChip() {
        const isMapEnabled = IsGISEnabled(this._context);
        return super._createViewMapChip({
            'IsEnabled': isMapEnabled,
            'IsButtonEnabled': isMapEnabled,
            'IsButtonVisible': isMapEnabled,
            'Action': '/SAPAssetManager/Rules/Maps/BeforeMTOverviewMapNav.js',
        });
    }

    _createRecordTimeTimesheetChip() {
        const isTimeSheetsEnabled = TimeSheetsIsEnabled(this._context) && !ConfirmationsIsEnabled(this._context);
        return super._createRecordTimeChip({
            'Label': this._context.localizeText('record_time'),
            'IsEnabled': isTimeSheetsEnabled,
            'IsButtonEnabled': isTimeSheetsEnabled,
            'IsButtonVisible': isTimeSheetsEnabled,
            'Action': '/SAPAssetManager/Rules/TimeSheets/Entry/CreateUpdate/TimeSheetEntryCreateNav.js',
        });
    }

    _createRecordTimeConfirmationChip() {
        const isConfirmationEnabled = IsAddConfirmationButtonVisible(this._context) && !TimeSheetsIsEnabled(this._context);
        const enable = EnableConfirmationCreate(this._context);

        return super._createRecordTimeChip({
            'Label': this._context.localizeText('confirmation_create_title'),
            'IsEnabled': enable,
            'IsButtonEnabled': enable,
            'IsButtonVisible': isConfirmationEnabled,
            'Action': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateUpdateNav.js',
            '_Name': 'RECORD_TIME_CONFIRMATION',
        });
    }
}
