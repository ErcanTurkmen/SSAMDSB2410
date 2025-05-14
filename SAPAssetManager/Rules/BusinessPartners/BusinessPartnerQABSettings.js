import QABSettings from '../QAB/QABSettings';
import IsBusinessPartnerAddNoteVisibile from './IsBusinessPartnerAddNoteVisibile';

export default class BusinessPartnerQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddNoteChip({
                'IsButtonVisibleBySettings': true,
                'Action': '/SAPAssetManager/Rules/BusinessPartners/BusinessPartnerCreateNoteOnPress.js',
                'IsButtonEnabled': await IsBusinessPartnerAddNoteVisibile(this._context),

            }),
            this._createAddBusinessPartnerChip({
                'IsButtonVisibleBySettings': true,
            }),
        ];

        return super.generateChips(chips);
    }
}
