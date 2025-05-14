import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SubEquipmentCount(context) {
    const odataType = context.getPageProxy().binding['@odata.type'];
    const { entitySet, queryOptions, service } = getSubEquipmentTargetOptions(context, odataType);

    return CommonLibrary.getEntitySetCount(context, entitySet, queryOptions, service).then(count => {
        context.getPageProxy().getClientData().SubEquipmentTotalCount = count;
        return count;
    });
}

export function getSubEquipmentTargetOptions(context, odataType) {
    let service = '/SAPAssetManager/Services/AssetManager.service';
    let entitySet = 'MyEquipments';
    let queryOptions = '';

    switch (odataType) {
        case '#sap_mobile.MyFunctionalLocation': {
            entitySet = context.getPageProxy().binding['@odata.readLink'] + '/Equipments';
            break;
        }
        case '#sap_mobile.MyEquipment': {
            queryOptions = `$filter=SuperiorEquip eq '${context.getPageProxy().binding.EquipId}'`;
            break;
        }
        case '#sap_mobile.FunctionalLocation': {
            entitySet = 'Equipments';
            queryOptions = `$filter=FuncLocIdIntern eq '${context.getPageProxy().binding.FuncLocIdIntern}'`;
            service = '/SAPAssetManager/Services/OnlineAssetManager.service';
            break;
        }
        case '#sap_mobile.Equipment': {
            entitySet = 'Equipments';
            queryOptions = `$filter=SuperiorEquip eq '${context.getPageProxy().binding.EquipId}'`;
            service = '/SAPAssetManager/Services/OnlineAssetManager.service';
            break;
        }
        default:
            break;
    }

    return {
        entitySet,
        queryOptions,
        service,
    };
}
