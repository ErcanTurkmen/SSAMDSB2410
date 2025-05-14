import QABSettings from '../../../QAB/QABSettings';

export default class WorkApprovalQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddNotificationChipWCMDetailsPage(),
            this._createAddWCMNoteChip(),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    }   
}
