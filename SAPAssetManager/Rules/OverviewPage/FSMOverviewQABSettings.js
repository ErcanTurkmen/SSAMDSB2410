import QABSettings from '../QAB/QABSettings';
import libPersona from '../Persona/PersonaLibrary';
import libCom from '../Common/Library/CommonLibrary';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import EnableConfirmationCreate from '../UserAuthorizations/Confirmations/EnableConfirmationCreate';


export default class FSMOverviewQABSettings extends QABSettings {
    constructor(context, isS4) {
        super(context, `${libPersona.getActivePersona(context)}-${libCom.getPageName(context)}${isS4 ? '-S4' : ''}`);

        this._isS4 = isS4;
    }

    generateChips() {
        let chips = [this._onlineSearch()];
        if (this._isS4) {
            chips.unshift(
                this._createAddServiceOrderChip(),
                this._createAddServiceRequestChip(),
                this._createAddServiceConfirmationChip(),
                this._createAddServiceQuotationChip(),
            );
        } else {
            chips.unshift(
                this._createAddWorkOrderChip({
                    'Label': this._context.localizeText('qab_create_service_order'),
                }),
                this._createAddNotificationChip({
                    'Label': this._context.localizeText('qab_create_service_notification'),
                }),
                this._createAddPurchaseRequisitionChip(),
                this._createRecordTimeConfirmationChip(),
            );
        }

        return super.generateChips(chips);
    }   
    
    _createRecordTimeConfirmationChip() {
        const isConfirmationEnabled = IsAddConfirmationButtonVisible(this._context);
        const enable = EnableConfirmationCreate(this._context);
        
        return super._createRecordTimeChip({
            'IsEnabled': enable,
            'IsButtonEnabled': isConfirmationEnabled,
            'IsButtonVisible': enable,
            'Action': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateUpdateNav.js',
            '_Name': 'RECORD_TIME_CONFIRMATION',
        });
    }
}
