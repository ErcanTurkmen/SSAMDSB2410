import commonLib from '../Common/Library/CommonLibrary';
import SRControlsLib from '../ServiceOrders/S4ServiceRequestControlsLibrary';

export default function SRRefObjectLinks(context) {
    const binding = context.binding;
    const equipValue = SRControlsLib.getEquipmentValue(context);
    const flocValue = SRControlsLib.getFunctionalLocationValue(context);
    const productValue = commonLib.getTargetPathValue(context, '#Page:ServiceRequestCreateUpdatePage/#Control:ProductLstPkr/#SelectedValue');
    const links = {
        create: [],
        update: [{
            'Property': 'S4ServiceRequest_Nav',
            'Target': {
                'EntitySet': 'S4ServiceRequests',
                'ReadLink': binding['@odata.readLink'],
            },
        }],
        delete: [],
    };

    pushCreateUpdateDeleteLink(links, equipValue, binding.EquipID, 'MyEquipments', 'MyEquipment_Nav');
    pushCreateUpdateDeleteLink(links, flocValue, binding.FlocID, 'MyFunctionalLocations', 'MyFunctionalLocation_Nav');
    pushCreateUpdateDeleteLink(links, productValue, binding.ProductID, 'Materials', 'Material_Nav');

    return links;
}

function pushCreateUpdateDeleteLink(links, refObjSelectedValue, refObjBindingValue, entitySet, property) {
    const refObjLink = {
        'Property': property,
        'Target': {
            'EntitySet': entitySet,
            'ReadLink': `${entitySet}('${refObjSelectedValue || refObjBindingValue}')`,
        },
    };

    /* if value is selected and ref object also exists in the binding, it's an update
    * if ref object doesn't exist in the binding, it's a create
    * if value is not selected, but ref object exists in the binding, this means user deselected the ref object. do a delete 
    * */
    if (commonLib.isDefined(refObjSelectedValue)) {
        links.update.push(refObjLink);
    } else if (commonLib.isDefined(refObjBindingValue)) {
        links.delete.push(refObjLink);
    }
}
