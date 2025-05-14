import libVal from '../../Common/Library/ValidationLibrary';

export default function BillToPartyPickerItemsDisplayValue(context) {
    const binding = context.binding;
    return `${binding.BusinessPartnerTo}${libVal.evalIsEmpty(binding.S4BusinessPartner_Nav) || libVal.evalIsEmpty(binding.S4BusinessPartner_Nav.FullName) ? '' : ' - ' + binding.S4BusinessPartner_Nav.FullName}`;
}
