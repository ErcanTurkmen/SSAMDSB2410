
export default function S4MobileStatusUpdateOverride(context, dataObject, nextStatus, mobileStatusNavLink = 'MobileStatus_Nav', successAction = '/SAPAssetManager/Rules/ServiceOrders/Status/ServiceOrderMobileStatusPostUpdate.js') {
    let data = dataObject || context.binding;
    let objectType = nextStatus.ObjectType;
    const orderStatusObjectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();
    const itemStatusObjectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
    
    if (!objectType) {
        objectType = data['@odata.type'] === '#sap_mobile.S4ServiceOrder' ? orderStatusObjectType : itemStatusObjectType;
    }

    let businessObjectType = data.ObjectType;
    if (data['@odata.type'] === '#sap_mobile.S4ServiceItem' || data['@odata.type'] === '#sap_mobile.S4ServiceConfirmationItem') {
        businessObjectType = data.ItemObjectType;
    }

    if (data['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        objectType = 'S4_SRV_CONF';
    }

    return {
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
        'Properties': {
            'Properties': {
                'EAMOverallStatusProfile': nextStatus.EAMOverallStatusProfile || '',
                'EAMOverallStatus': nextStatus.EAMOverallStatus || '',
                'Status': nextStatus.Status,
                'MobileStatus': nextStatus.MobileStatus,
                'ObjectType': objectType,
                'EffectiveTimestamp': '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
                'BusinessObjectType': businessObjectType,
                'S4ObjectID': data.ObjectID,
                'S4ItemNum': data.ItemNo || '',
                'CreateUserGUID': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesUserGuidOnCreate.js',
                'CreateUserId': '/SAPAssetManager/Rules/MobileStatus/GetSAPUserId.js',
                'ObjectKey': data[mobileStatusNavLink].ObjectKey,
            },
            'Target': {
                'EntitySet': 'PMMobileStatuses',
                'ReadLink': data[mobileStatusNavLink]['@odata.readLink'],
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
            },
            'Headers': {
                'OfflineOData.NonMergeable': true,
            },
            'UpdateLinks': [
                {
                    'Property': 'OverallStatusCfg_Nav',
                    'Target': {
                        'EntitySet': 'EAMOverallStatusConfigs',
                        'QueryOptions': `$filter=MobileStatus eq '${nextStatus.MobileStatus}' and ObjectType eq '${objectType}'`,
                    },
                },
            ],
            ...(successAction ? { 'OnSuccess': successAction } : {}),
            'ActionResult': {
                '_Name': 'MobileStatusUpdate',
            },
        },
    };
}
