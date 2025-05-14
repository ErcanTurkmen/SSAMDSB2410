import GetGeometryInformation from '../Common/GetGeometryInformation';
import AddressMapValue from '../Maps/AddressMapValue';

export default function IsViewMapButtonVisible(context) {
    const binding = context.getPageProxy().binding;
    const geometryPrefix = getGeometryPrefix(binding);

    if (!geometryPrefix && binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        if (binding.address) {
            return true;
        } else {
            return AddressMapValue(context.getPageProxy()).then(()=> {
                return context.getPageProxy().binding.address;
            });
        }
    }

    let geometryItem = context.getPageProxy().getClientData().geometry;
    if (geometryItem && Object.keys(geometryItem).length > 0) {
        // geometryItem is valid and defined
        return true;
    } else {
        // geometryItem is defined, but empty
        if (geometryItem) {
            if (geometryPrefix === 'WOGeometries' || geometryPrefix === 'NotifGeometries') {
                return context.read('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/FunctionalLocation', [], '').then(function(result) {
                    return result && result.getItem(0);
                });
            } else {
                return false;
            }
        } else {
            // geometryItem is invalid and needs to be read
            return GetGeometryInformation(context.getPageProxy(), geometryPrefix).then(function(value) {
                return !!(value && Object.keys(value).length > 0);
            });
        }
    }
}

// get geometry prefix based on @odata.type
function getGeometryPrefix(binding) {
    switch (binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
            return 'WOGeometries';
        case '#sap_mobile.MyNotificationHeader':
            return 'NotifGeometries';
        case '#sap_mobile.MyFunctionalLocation':
            return 'FuncLocGeometries';
        case '#sap_mobile.MyEquipment':
            return 'EquipGeometries';
        case '#sap_mobile.S4ServiceOrder':
            return '';
        default:
            return '';
    }
}
