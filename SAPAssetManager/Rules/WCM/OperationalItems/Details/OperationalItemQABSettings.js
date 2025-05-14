import QABSettings from '../../../QAB/QABSettings';

export default class OperationalItemQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddNotificationChipWCMDetailsPage(),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    }   
}
