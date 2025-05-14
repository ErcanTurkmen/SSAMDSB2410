import QABSettings from '../../../QAB/QABSettings';
import IsServiceRequestIsNotCompleted from './IsServiceRequestIsNotCompleted';

export default class ServiceRequestQABSettings extends QABSettings {
    async generateChips() {
        const requestIsNotCompleted = await IsServiceRequestIsNotCompleted(this._context);

        const chips = [
            this._createAddServiceOrderChip({
                'Label': this._context.localizeText('add_service_order'),
            }),
            await this._createDownloadDocumentsChip(),
            this._createAddNoteChip({
                'IsButtonEnabled': requestIsNotCompleted,
                'IsButtonVisibleBySettings': false,
            }),
            this._createAddReminderChip({
                'IsButtonEnabled': requestIsNotCompleted,
                'IsButtonVisibleBySettings': false,
            }),
            this._createAddAttachmentChip(),
            this._createBusinessPartnersChip(),
        ];

        return super.generateChips(chips);
    }
}
