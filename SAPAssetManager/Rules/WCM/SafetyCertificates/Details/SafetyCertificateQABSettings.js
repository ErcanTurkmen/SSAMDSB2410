import QABSettings from '../../../QAB/QABSettings';
import libPersona from '../../../Persona/PersonaLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

export default class SafetyCertificateQABSettings extends QABSettings {
    constructor(context, isLOTO) {
        super(context, `${libPersona.getActivePersona(context)}-${libCom.getPageName(context)}${isLOTO ? '-LOTO' : ''}`);

        this._isLOTO = isLOTO;
    }

    async generateChips() {
        const chips = [
            this._createAddNotificationChipWCMDetailsPage(),
            this._createChip({
                'Label': this._context.localizeText('add_operational_item'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddOperationalItem.ios.light.png,/SAPAssetManager/Images/QABAddOperationalItem.android.light.png)',
                'IsButtonEnabled': this._isLOTO,
                'Action': '/SAPAssetManager/Rules/WCM/OperationalItems/Create/OperationalItemCreateNav.js',
                '_Name': 'ADD_OPERATIONAL_ITEM',
            }),
            this._createAddWCMNoteChip(),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    }   
}
