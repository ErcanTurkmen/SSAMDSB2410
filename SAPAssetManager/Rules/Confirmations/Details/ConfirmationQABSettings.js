import QABSettings from '../../QAB/QABSettings';
import IsEditServiceConfirmationEnabled from './IsEditServiceConfirmationEnabled';
import AddConfirmationToServiceItemEnabled from '../../ServiceOrders/ServiceItems/AddConfirmationToServiceItemEnabled';

export default class ConfirmationQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddServiceConfirmationChip({
                'Label': this._context.localizeText('confirm_item'),
                'IsButtonEnabled': await AddConfirmationToServiceItemEnabled(this._context),
            }),
            this._createAddNoteChip({
                'IsButtonVisibleBySettings': false,
                'IsButtonEnabled': await IsEditServiceConfirmationEnabled(this._context),
            }),
            await this._createDownloadDocumentsChip(),
            this._createAddServiceQuotationChip(),
        ];

        return super.generateChips(chips);
    }
}
