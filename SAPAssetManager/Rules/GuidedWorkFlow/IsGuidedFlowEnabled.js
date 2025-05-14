import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';
import libCom from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

export default function IsGuidedFlowEnabled(context) {
    const featureEnabled = UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GuidedFlow.global').getValue());
    const asignmentType = libCom.getWorkOrderAssnTypeLevel(context);
    const s4asignmentType = libCom.getS4AssnTypeLevel(context);
    let binding = context.binding;
    if (ValidationLibrary.evalIsEmpty(binding) || !ValidationLibrary.evalIsEmpty(binding) && ValidationLibrary.evalIsEmpty(binding['@odata.type'])) {
        binding = context.getPageProxy().getActionBinding();
    }
    let entityType = binding['@odata.type'];
    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader':
            return (featureEnabled && asignmentType === 'Header');
        case '#sap_mobile.MyWorkOrderOperation':
            return (featureEnabled && asignmentType === 'Operation');
        case '#sap_mobile.MyWorkOrderSubOperation':
            return (featureEnabled && asignmentType === 'SubOperation');
        case '#sap_mobile.S4ServiceOrder':
            return (featureEnabled && s4asignmentType === 'Header');
        case '#sap_mobile.S4ServiceItem':
            return (featureEnabled && s4asignmentType === 'Item');
        default:
            break;
    }
    return false;
}
