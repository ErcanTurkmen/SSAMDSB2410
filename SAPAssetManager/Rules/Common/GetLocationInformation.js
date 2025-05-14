import locationLib from '../Common/Library/LocationLibrary';
import { GlobalVar } from '../Common/Library/GlobalCommon';
import ValidationLibrary from './Library/ValidationLibrary';
import CommonLibrary from './Library/CommonLibrary';

/**
 * Gets the Location Name given a Location and a Plant
 * @param {Context} context generic context used for read operations
 * @param {String} location Numeric Location value
 * @param {String} plant Numeric Plant value
 * @returns {Promise<Location>} a Promise containing the Location Description or null
 */
function getLocationName(context, location, plant) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `Locations(Location='${location}',Plant='${plant}')`, [], '').then(function(/** @type {ObservableArray<Location>} */ result) {
        if (result && result.getItem(0))
            return result.getItem(0).LocationName;
        else
            return null;
    });
}

/**
 * Recursively finds the geometry for a given top-level entity. Currently accepts Work Orders, Notifications, Functional Locations, and Equipment
 * @param {Context} context a generic context used for read operations
 * @param {String} type an entity type. Currently accepts 'MyWorkOrderHeader', 'MyNotificationHeader', 'MyEquipment', and 'FunctionalLocation'
 * @param {String?} binding optional binding containing a readLink to an entity. Used for retrieving Geometry values
 * @returns a Promise containing formatted geocoordinates or null
 */
export function getGeometryData(context, type, binding, checkLinkedTechnicalObjectGometry = true) {

    if (!binding) {
        binding = context.binding;
    }

    switch (type) {
        case 'MyWorkOrderHeader':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/WOGeometries', [], '$expand=Geometry').then(function(data) {
                let geometryData;
                if (data && data.getItem(0) && (geometryData = data.getItem(0).Geometry)) {
                    if (geometryData && geometryData.GeometryValue) {
                        return geometryData;
                    }
                }
                if (checkLinkedTechnicalObjectGometry && binding.HeaderEquipment) {
                    return getGeometryData(context, 'MyEquipment', { '@odata.readLink': `MyEquipments('${binding.HeaderEquipment}')` });
                } else {
                    return null;
                }
            });
        case 'MyNotificationHeader':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/NotifGeometries', [], '$expand=Geometry').then(function(data) {
                let geometryData;
                if (data && data.getItem(0) && (geometryData = data.getItem(0).Geometry)) {
                    if (geometryData && geometryData.GeometryValue) {
                        return geometryData;
                    }
                }
                if (checkLinkedTechnicalObjectGometry && binding.HeaderEquipment) {
                    return getGeometryData(context, 'MyEquipment', { '@odata.readLink': `MyEquipments('${binding.HeaderEquipment}')` });
                } else {
                    return null;
                }
            });
        case 'MyEquipment':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/EquipGeometries', [], '$expand=Geometry').then(function(data) {
                let geometryData;
                if (data && data.getItem(0) && (geometryData = data.getItem(0).Geometry)) {
                    if (geometryData && geometryData.GeometryValue) {
                        return geometryData;
                    }
                }
                if (checkLinkedTechnicalObjectGometry && binding.FuncLocId) {
                    return getGeometryData(context, 'MyFunctionalLocation', { '@odata.readLink': `MyFunctionalLocations('${binding.FuncLocId}')` });
                } else {
                    return null;
                }
            });
        case 'MyFunctionalLocation':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/FuncLocGeometries', [], '$expand=Geometry').then(function(data) {
                let geometryData;
                if (data && data.getItem(0) && (geometryData = data.getItem(0).Geometry)) {
                    if (geometryData && geometryData.GeometryValue) {
                        return geometryData;
                    }
                }
                return null;
            });
        default:
            return Promise.reject('Invalid type');
    }
}

export default function GetLocationInformation(context, checkLinkedTechnicalObjectGometry = true) {
    context = context.getPageProxy();

    if (ValidationLibrary.evalIsEmpty(context.binding)) {
        if (context._page && context._page.previousPage &&
            context._page.previousPage.definition.name === 'MapExtensionControlPage') {
            const editInfo = Object.assign({}, context._page.previousPage.editModeInfo);
            return Promise.resolve(editInfo ? editInfo : '');
        }

        return Promise.resolve('');
    }

    // Get type, minus prefix
    let odataTypeString = context.binding['@odata.type'];
    let type = odataTypeString ? odataTypeString.substring('#sap_mobile.'.length) : '';

    if (!checkLinkedTechnicalObjectGometry) {
        // Get Geo-Coords
        return getGeometryData(context, type, null, checkLinkedTechnicalObjectGometry).then(geometryData => {
            if (geometryData?.GeometryValue) {
                return locationLib.formatLocationStringObject(context, geometryData?.GeometryValue);
            }
            return null;
        });
    }

    // Get the Plant (for looking up the Location)
    let plant = '';
    switch (context.binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
            plant = CommonLibrary.getDefaultUserParam('USER_PARAM.IWK')? CommonLibrary.getDefaultUserParam('USER_PARAM.IWK') : GlobalVar.getAppParam().WORKORDER.PlanningPlant;
            break;
        case '#sap_mobile.MyNotificationHeader':
            plant = CommonLibrary.getDefaultUserParam('USER_PARAM.IWK')? CommonLibrary.getDefaultUserParam('USER_PARAM.IWK') : GlobalVar.getAppParam().NOTIFICATION.PlanningPlant;
            break;
        default:
            break;
    }

    if (type === 'MyWorkOrderHeader' || type === 'MyNotificationHeader') {
        let flocPromise = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/FunctionalLocation', [], '');
        let equipPromise = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Equipment', [], '');

        return Promise.all([flocPromise, equipPromise]).then(function(resultsArray) {
            // FLOC Data
            let flocData = resultsArray[0] && resultsArray[0].getItem(0) ? resultsArray[0].getItem(0) : null;
            // Equipment Data
            let equipData = resultsArray[1] && resultsArray[1].getItem(0) ? resultsArray[1].getItem(0) : null;

            if (flocData) {
                if (flocData.Location) {
                    // Return FLOC Location Description, if available. Otherwise, return FLOC description
                    return getLocationName(context, flocData.Location, plant).catch(function() {
                        // Get Geo-Coords
                        return getGeometryData(context, type, null, checkLinkedTechnicalObjectGometry).then(geometryData => {
                            return locationLib.formatLocationStringObject(context, geometryData.GeometryValue);
                        });
                    });
                } else {
                    return flocData.FuncLocDesc;
                }
            } else if (equipData) {
                if (equipData.Location) {
                    // Return Equipment Location Description, if available.
                    return getLocationName(context, equipData.Location, plant).catch(function() {
                        // Get Geo-Coords
                        return getGeometryData(context, type, null, checkLinkedTechnicalObjectGometry).then(geometryData => {
                            return locationLib.formatLocationStringObject(context, geometryData.GeometryValue);
                        });
                    });
                } else {
                    return equipData.EquipDesc;
                }
            } else {
                // Get Geo-Coords
                return getGeometryData(context, type, null, checkLinkedTechnicalObjectGometry).then(geometryData => {
                    return locationLib.formatLocationStringObject(context, geometryData.GeometryValue);
                });
            }
        });
    } else if (type === 'MyEquipment') {
        let flocPromise = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/FunctionalLocation', [], '$expand=Location_Nav');

        return flocPromise.then(function(flocData) {
            if (flocData && flocData.getItem(0)) {
                if (flocData.getItem(0).Location_Nav) {
                    return flocData.getItem(0).Location_Nav.Location + ' - ' + flocData.getItem(0).Location_Nav.LocationName;
                } else {
                    // Get FLOC Location
                    return flocData.getItem(0).FuncLocId + ' - ' + flocData.getItem(0).FuncLocDesc;
                }
            } else {
                // Get Geo-Coords
                return getGeometryData(context, type, null, checkLinkedTechnicalObjectGometry).then(geometryData => {
                    return locationLib.formatLocationStringObject(context, geometryData.GeometryValue);
                });
            }
        });
    } else if (type === 'MyFunctionalLocation') {
        let flocPromise = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Location_Nav');

        return flocPromise.then(function(flocData) {
            if (flocData && flocData.getItem(0)) {
                if (flocData.getItem(0).Location_Nav) {
                    return flocData.getItem(0).Location_Nav.Location + ' - ' + flocData.getItem(0).Location_Nav.LocationName;
                } else {
                    // Get FLOC Location
                    return flocData.getItem(0).FuncLocId + ' - ' + flocData.getItem(0).FuncLocDesc;
                }
            } else {
                // Get Geo-Coords
                return getGeometryData(context, type, null, checkLinkedTechnicalObjectGometry).then(geometryData => {
                    return locationLib.formatLocationStringObject(context, geometryData.GeometryValue);
                });
            }
        });
    }

    if (context._page && context._page.previousPage &&
        context._page.previousPage.definition.name === 'MapExtensionControlPage') {
        const editInfo = Object.assign({}, context._page.previousPage.editModeInfo);
        return Promise.resolve(editInfo ? editInfo : '');
    }

    return Promise.resolve('');
}

//The function converts a map data object into a location string that can be used in a control.
export function formatLocationInfo(context, oInfo) {
    let sValue = '';

    if (oInfo.geometryType) {
        sValue = context.localizeText(oInfo.geometryType.toLowerCase());
    }

    if (oInfo.geometryValue) {
        const parsedValues = JSON.parse(oInfo.geometryValue);

        sValue += sValue ? ': ' : '';
        if (parsedValues.x && parsedValues.y) {
            sValue += parsedValues.y + ',' + parsedValues.x;
        } else {
            sValue += parsedValues.spatialReference.wkid;
        }
    }

    return sValue;
}

export function locationInfoFromObjectType(context, objectType, objectKey) {
    switch (objectType) {
        case 'IEQ': return context.localizeText('equipment') + ' ' + objectKey;
        case 'IFL': return context.localizeText('functional_location') + ' ' + objectKey;
        case 'NO1': return context.localizeText('notification') + ' ' + objectKey;
        case 'ORH': return context.localizeText('workorder') + ' ' + objectKey;
        default: return context.localizeText('view_on_map');
    }
}
