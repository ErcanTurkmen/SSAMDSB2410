import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionPointUpdateEntitySet(context) {
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding)) {
        binding = libCom.getStateVariable(context, 'FDCPreviousPageBinding');
    }
    if (binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        return binding['@odata.readLink'];
    } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return binding.InspectionPoint_Nav['@odata.readLink'];
    } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return binding.InspectionPoint_Nav[0]['@odata.readLink'];
    }
    return `InspectionLots('${binding.InspectionLot}')` + '/InspectionPoints_Nav';
}
