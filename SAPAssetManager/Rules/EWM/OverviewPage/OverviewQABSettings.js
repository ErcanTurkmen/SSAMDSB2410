import QABSettings from '../../QAB/QABSettings';

export default class OverviewQABSettings extends QABSettings {
    generateChips() {
        const chips = [
            this._createChip({
                'Label': this._context.localizeText('switch_resource'),
                'Icon': '$(PLT,/SAPAssetManager/Images/transfer.png,/SAPAssetManager/Images/transfer.android.png)',
                'Action': '/SAPAssetManager/Actions/EWM/OverviewPage/ResourceListViewNav.action',
                '_Name': 'SwitchResource',
            }),
        ];
        return super.generateChips(chips);
    }
}
