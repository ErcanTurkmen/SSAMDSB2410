import libVal from '../../Common/Library/ValidationLibrary';

export default function RelatedWorkPermitsReadLink(context) {
    const binding = context.binding;
    if (libVal.evalIsEmpty(binding)) {
        return 'WCMApplications';
    }

    switch (binding['@odata.type']) {
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue():
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue():
            return binding['@odata.readLink'] + '/WCMApplications_Nav';   
        default:
            return 'WCMApplications';
    }
}
