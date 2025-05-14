import QABSettings from '../../QAB/QABSettings';
import IsGISEnabled from '../../Maps/IsGISEnabled';

export default class OverviewQABSettings extends QABSettings {
    generateChips() {
        const chips = [
            this._createChipViewTaggingList(),
            this._createChipViewUntaggingList(),
            this._createAddNotificationChip(),
            this._createAddReminderChip(),
            this._createViewMapChip(),
        ];

        return super.generateChips(chips);
    }

    _createViewMapChip() {
        const isMapEnabled = IsGISEnabled(this._context);
        return super._createViewMapChip({
            'IsEnabled': isMapEnabled,
            'IsButtonEnabled': isMapEnabled,
            'IsButtonVisible': true,
            'Action': '/SAPAssetManager/Rules/Maps/BeforeMapSideMenuNav.js',
        });
    }
}
