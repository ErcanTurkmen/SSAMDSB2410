import commonLib from '../Common/Library/CommonLibrary';
import SOControlsLib from '../ServiceOrders/S4ServiceOrderControlsLibrary';
import S4ServiceQuotationControlsLibrary from '../ServiceOrders/S4ServiceQuotationControlsLibrary';

export default function RefObjectLinks(context) {
    const binding = context.binding;
    const equipValue = SOControlsLib.getEquipmentValue(context);
    const flocValue = SOControlsLib.getFunctionalLocationValue(context);
    const productValue = commonLib.getTargetPathValue(context, '#Page:ServiceOrderCreateUpdatePage/#Control:ProductLstPkr/#SelectedValue');
    const links = {
        create: [],
        update: [{
            'Property': 'S4ServiceOrder_Nav',
            'Target': {
                'EntitySet': 'S4ServiceOrders',
                'ReadLink': binding['@odata.readLink'],
            },
        }],
        delete: [],
    };

    pushCreateUpdateDeleteLink(links, equipValue, binding.HeaderEquipment, 'MyEquipments', 'Equipment_Nav');
    pushCreateUpdateDeleteLink(links, flocValue, binding.HeaderFunctionLocation, 'MyFunctionalLocations', 'FuncLoc_Nav');
    pushCreateUpdateDeleteLink(links, productValue, binding.Product, 'Materials', 'Material_Nav');
    
    return links;
}

export function QuotationRefObjectLinks(context) {
    const binding = context.binding;
    const equipValue = S4ServiceQuotationControlsLibrary.getEquipmentValue(context);
    const flocValue = S4ServiceQuotationControlsLibrary.getFunctionalLocationValue(context);
    const productValue = commonLib.getTargetPathValue(context, '#Page:ServiceQuotationCreateUpdatePage/#Control:ProductLstPkr/#SelectedValue');
    const links = {
        create: [],
        update: [{
            'Property': 'S4ServiceQuotation_QuotPartner_Nav',
            'Target': {
                'EntitySet': 'S4ServiceQuotations',
                'ReadLink': binding['@odata.readLink'],
            },
        }],
        delete: [],
    };

    pushCreateUpdateDeleteLink(links, equipValue, binding.HeaderEquipment, 'MyEquipments', 'Equipment_Nav');
    pushCreateUpdateDeleteLink(links, flocValue, binding.HeaderFunctionLocation, 'MyFunctionalLocations', 'FuncLoc_Nav');
    pushCreateUpdateDeleteLink(links, productValue, binding.Product, 'Materials', 'Material_Nav');
    
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
        if (commonLib.isDefined(refObjBindingValue)) {
            links.update.push(refObjLink);
        } else {
            links.create.push(refObjLink);
        }
    } else if (commonLib.isDefined(refObjBindingValue)) {
        links.delete.push(refObjLink);
    }
}
