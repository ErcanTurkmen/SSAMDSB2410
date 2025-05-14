import GetGeometryInformation from '../Common/GetGeometryInformation';
import libEval from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import personalLib from '../Persona/PersonaLibrary';
import AddressMapValue from '../Maps/AddressMapValue';
import BeforeMapNav from '../Maps/BeforeMapNav';

export default function WorkOrderMapNav(context) {
    // close the page and return if coming from the MapExtensionControlPage
    if (context._page && context._page.previousPage &&
        context._page.previousPage.definition.name.includes('MapExtensionControlPage')) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        let address = context.binding.address;
        if (address) {
            context.getPageProxy().setActionBinding(context.binding);
            return BeforeMapNav(context, '/SAPAssetManager/Actions/Extensions/FSMS4ServiceOrderMapNav.action');
        } else {
            return AddressMapValue(context).then(()=> {
                address = context.binding.address;
        
                if (address) {
                    context.getPageProxy().setActionBinding(context.binding);
                    return BeforeMapNav(context, '/SAPAssetManager/Actions/Extensions/FSMS4ServiceOrderMapNav.action');
                } else {
                    return Promise.resolve();
                }
            });
        }
    }

    const geometry = context.getBindingObject().geometry;

    if (geometry && Object.keys(geometry).length > 0) {
        // If this is a valid Work Order, navigate immediately
        if (personalLib.isFieldServiceTechnician(context)) {
            context.getPageProxy().setActionBinding(context.binding);
            return BeforeMapNav(context, '/SAPAssetManager/Actions/Extensions/FSMServiceOrderMapNav.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action');
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'AddressDetSequences', [], `$filter=PMObjectType eq '${context.binding.OrderType}'&$orderby=SequenceNo asc`).then(function(val) {
        libCom.setStateVariable(context, 'sequences', val);
        return GetGeometryInformation(context.getPageProxy(), 'WOGeometries').then(function(value) {

            // create-update
            if (libCom.getPageName(context) === 'WorkOrderCreateUpdatePage') {
                const onCreate = libCom.IsOnCreate(context);
                if (onCreate) {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapCreateNav.action');
                } else {
                    // set action binding for edit case, if returned geometry is for workorder
                    if (value && value['@odata.type']=== '#sap_mobile.MyWorkOrderHeader') {
                        context.getPageProxy().setActionBinding(value);
                    }
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapUpdateNav.action');
                }
            }

            context.getPageProxy().setActionBinding(value);
            if (value && value['@odata.type']=== '#sap_mobile.MyFunctionalLocation' && !libEval.evalIsEmpty(value.FuncLocGeometries) && value.FuncLocGeometries[0].Geometry) {
                return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
            }
            if (value && value['@odata.type']=== '#sap_mobile.MyEquipment' && !libEval.evalIsEmpty(value.EquipGeometries) && value.EquipGeometries[0].Geometry) {
                return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
            }

            if (value && personalLib.isFieldServiceTechnician(context)) {
                return BeforeMapNav(context, '/SAPAssetManager/Actions/Extensions/FSMServiceOrderMapNav.action');
            }

            return value && !libEval.evalIsEmpty(value.WOGeometries) ? context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action') : null;
        });
    });
}
