import QABSettings from '../../QAB/QABSettings';

export default class ServiceQuotationItemQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createS4ErrorsChip(),
            this._createChip({
                'Label': this._context.localizeText('add_quotation_item'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddItem.png,/SAPAssetManager/Images/QABAddItem.android.png)',
                'Action': '/SAPAssetManager/Rules/ServiceQuotations/Items/CreateUpdate/CreateServiceQuotationItemNav.js',
                '_Name': 'ADD_ITEM',
            }),
            this._createBusinessPartnersChip({'IsButtonVisibleBySettings': true}),
            this._createRefObjectsChip(),
            this._createAddNoteChip(),
            this._createChip({
                'Label': this._context.localizeText('add_attachment'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddAttachment.ios.png,/SAPAssetManager/Images/QABAddAttachment.android.png)',
                'Action': '/SAPAssetManager/Rules/Documents/Create/DocumentCreateBDSNav.js',
                '_Name': 'ADD_ATTACHMENT',
            }),
          this._createAddReminderChip({'IsButtonVisibleBySettings': false}),
        ];

        return super.generateChips(chips);
    }
}
