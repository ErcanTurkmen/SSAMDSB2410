import QABSettings from '../../QAB/QABSettings';
import AddConfirmationToServiceItemEnabled from '../../ServiceOrders/ServiceItems/AddConfirmationToServiceItemEnabled';

export default class ConfirmationItemQABSettings extends QABSettings {
    async generateChips() {
        return super.generateChips([
            this._createAddServiceConfirmationChip({
            'Label': this._context.localizeText('confirm_item'),
            'IsButtonEnabled': await AddConfirmationToServiceItemEnabled(this._context, this._context.binding.S4ServiceConfirmation_Nav),
        }),
    ]);
    }
}
