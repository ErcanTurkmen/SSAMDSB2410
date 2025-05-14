import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceItemTypeText(clientAPI) {
    const binding = clientAPI.binding;
    if (binding) {
        if (binding.ItemCategory_Nav) {
            return binding.ItemCategory_Nav.Description;
        } else {
            return S4ServiceLibrary.isServiceTravelExpenceItem(clientAPI, binding) 
                ? clientAPI.localizeText('expense')
                : clientAPI.localizeText('service_item');
        }
    }
    return '';
}
