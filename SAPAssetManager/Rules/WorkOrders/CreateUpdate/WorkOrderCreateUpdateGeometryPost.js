import GetGeometryType from '../../Geometries/GetGeometryType';
import GetObjectGroup from '../../Geometries/GetObjectGroup';
import ObjectKeyFromMap from '../../Geometries/ObjectKeyFromMap';
import GeometryType from '../../Geometries/GeometryType';
import IsGefEnabled from '../../Geometries/IsGefEnabled';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryValue from '../../Geometries/GeometryValue';
import { WorkOrderDetailsPageName } from '../Details/WorkOrderDetailsPageToOpen';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default async function WorkOrderCreateUpdateGeometryPost(context) {
    const binding = getBindingObject(context);

    const woGeometriesReadLink = getWOGeometriesReadLink(context, binding);
    if (!woGeometriesReadLink) return Promise.resolve();

    const woGeometry = await readWOGeometries(context, woGeometriesReadLink);
    if (woGeometry) { // geometry exists, so this is an update case
        context.getPageProxy().setActionBinding(woGeometry.Geometry);
        return context.executeAction('/SAPAssetManager/Actions/Geometries/GeometryUpdate.action');
    } else {
        const geometryValue = GeometryValue(context);
        if (libVal.evalIsEmpty(geometryValue)) { // geometry does not exist, so this is a delete case
            return Promise.resolve();
        }

        // Create case
        const isGefEnabled = await IsGefEnabled(context);
        const isWOChangedFromMapPage = !!context.currentPage.woBinding;
        const createdWOGeometry = await createMyWorkOrderGeometry(context, binding, isWOChangedFromMapPage, isGefEnabled); // create MyWorkOrderGeometries
        const createdGeometry = await createGeometryObject(context, binding, createdWOGeometry, isWOChangedFromMapPage, isGefEnabled); // create Geometries
        await updateWorkOrderGeometry(context, createdWOGeometry, createdGeometry); // update MyWorkOrderGeometries links

        return Promise.resolve();
    }
}

function getBindingObject(context) {
    let binding = context.currentPage.woBinding || context.binding || {};

    if (CommonLibrary.getCurrentPageName(context) === 'WorkOrderCreateUpdatePage') {
        binding = context.evaluateTargetPathForAPI('#Page:-Previous').binding || {};
    }

    return binding;
}

function getWOGeometriesReadLink(context, binding) {
    let readLink = binding['@odata.editLink'] + '/WOGeometries';

    if (binding['@odata.type'] !== '#sap_mobile.MyWorkOrderHeader') {
        const objectKey = ObjectKeyFromMap(context);
        if (libVal.evalIsNotEmpty(objectKey)) {
            readLink = 'MyWorkOrderHeaders(\'' + objectKey + '\')' + '/WOGeometries';
        } else {
            readLink = undefined;
        }
    }

    return readLink;
}

function readWOGeometries(context, woGeometriesReadLink) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', woGeometriesReadLink, [], '$expand=Geometry')
        .then(result => result.length ? result.getItem(0) : null)
        .catch(error => {
            Logger.error('readWOGeometries', error);
            return null;
        });
}

async function createMyWorkOrderGeometry(context, binding, isWOChangedFromMapPage, isGefEnabled) {
    const workOrderDetailsPageName = WorkOrderDetailsPageName(context);
    const objectKey = isWOChangedFromMapPage ? binding.OrderId : `#Page:${workOrderDetailsPageName}/#Property:OrderId`;
    const woReadLink = isWOChangedFromMapPage ? binding['@odata.editLink'] : `#Page:${workOrderDetailsPageName}/#Property:@odata.readLink`;

    const actionProperties = {
        'Properties': {
            'ObjectType': 'ORH',
            'ObjectKey': objectKey,
            'OrderId': objectKey,
            ...(isGefEnabled ? { 'ObjectGroup': await GetObjectGroup(context, 'ORH') } : {}),
        },
        'Headers': {
            'OfflineOData.TransactionID': objectKey,
        },
        'CreateLinks': [
            {
                'Property': 'WOHeader_Nav',
                'Target': {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': woReadLink,
                },
            },
        ],
    };

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/CreateWorkOrderGeometry.action',
        'Properties': actionProperties,
    }).then((result) => {
        if (result?.data) {
            return JSON.parse(result.data);
        }

        return undefined;
    }).catch(error => {
        Logger.error('createMyWorkOrderGeometry', error);
        return undefined;
    });
}

async function createGeometryObject(context, binding, createdWOGeometry, isWOChangedFromMapPage, isGefEnabled) {
    if (!createdWOGeometry) return Promise.resolve(undefined);

    const workOrderDetailsPageName = WorkOrderDetailsPageName(context);
    const objectKey = isWOChangedFromMapPage ? binding.OrderId : `#Page:${workOrderDetailsPageName}/#Property:OrderId`;
    const woReadLink = isWOChangedFromMapPage ? binding['@odata.editLink'] : `#Page:${workOrderDetailsPageName}/#Property:@odata.readLink`;
    const actionProperties = {
        'Properties': {
            'ObjectType': 'ORH',
            'ObjectKey': objectKey,
            'OutputFormat': 'json',
            'GeometryValue': '/SAPAssetManager/Rules/Geometries/GeometryValueFromPage.js',
        },
        'CreateLinks': [
            {
                'Property': 'WOHeader_Nav',
                'Target': {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': woReadLink,
                },
            },
            {
                'Property': 'WOGeometries',
                'Target': {
                    'EntitySet': 'MyWorkOrderGeometries',
                    'ReadLink': createdWOGeometry['@odata.readLink'],
                },
            },
        ],
    };

    if (isGefEnabled) {
        const objectGroup = await GetObjectGroup(context, 'ORH');
        const geometryType = await GetGeometryType(context, GeometryType(context));
        actionProperties.Properties.ObjectGroup = objectGroup;
        actionProperties.Properties.GeometryType = geometryType;
    }

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action',
        'Properties': actionProperties,
    }).then((result) => {
        if (context.currentPage.woBinding) {
            context.currentPage.woBinding = null;
        }

        if (result?.data) {
            return JSON.parse(result.data);
        }

        return undefined;
    }).catch(error => {
        Logger.error('createGeometryObject', error);
        return undefined;
    });
}

function updateWorkOrderGeometry(context, createdWOGeometry, createdGeometry) {
    if (!createdWOGeometry || !createdGeometry) return Promise.resolve(undefined);

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderUpdateWOGeometry.action',
        'Properties': {
            'Target': {
                'ReadLink': createdWOGeometry['@odata.readLink'],
            },
            'CreateLinks': [
                {
                    'Property': 'Geometry',
                    'Target': {
                        'EntitySet': 'Geometries',
                        'ReadLink': createdGeometry['@odata.readLink'],
                    },
                },
            ],
        },
    });
}
