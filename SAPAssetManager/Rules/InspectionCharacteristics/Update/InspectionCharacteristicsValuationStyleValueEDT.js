/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsValuationStyleValueEDT(clientAPI) {
    if (clientAPI.binding.InspValuation_Nav && (clientAPI.binding.InspValuation_Nav.Valuation === 'R' || clientAPI.binding.InspValuation_Nav.Valuation === 'F')) {
        return {FontColor: 'bb0000'};
    } else if (clientAPI.binding.InspValuation_Nav && clientAPI.binding.InspValuation_Nav.Valuation === 'A') {
        return {FontColor: '107e3e'};
    }
    return {FontColor: '76767b'};
}
