export default function ContainerItemsFootnote(clientAPI) {
    return [clientAPI.binding.VoyageNumber, clientAPI.binding.HandlingUnitID].filter(text => text).join(', ');
}
