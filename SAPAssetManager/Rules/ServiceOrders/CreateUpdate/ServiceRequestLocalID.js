import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';

export default function ServiceRequestLocalID(context) {
    if (context.binding?.ObjectID && context.binding?.['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        return context.binding.ObjectID;
    }
    
    return GenerateLocalID(context, 'S4ServiceRequests', 'ObjectID', '000', "$filter=startswith(ObjectID, 'LOCAL') eq true", 'LOCAL_S').then(LocalId => {
        libCom.setStateVariable(context, 'LocalId', LocalId);
        return LocalId;
    });
}
