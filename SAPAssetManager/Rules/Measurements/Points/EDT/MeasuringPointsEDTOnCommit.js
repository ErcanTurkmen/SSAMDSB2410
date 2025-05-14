import ODataDate from '../../../Common/Date/ODataDate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';
import LAMMeasurementDocTableKey from '../../../LAM/CreateUpdate/LAMMeasurementDocTableKey';
import Logger from '../../../Log/Logger';
import IsS4ServiceIntegrationEnabled from '../../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import EDTHelper from './MeasuringPointsEDTHelper';
import MeasuringPointLibrary from '../../MeasuringPointLibrary';

export default async function MeasuringPointsEDTOnCommit(context) {
    let actionsPromises = [];
    let cachedSectionsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings') || [];

    let newDocIndex = 0;
    cachedSectionsBindings.forEach(sectionBinding => {
        sectionBinding.forEach((rowBinding, rowIndex) => {
            let latestDoc = EDTHelper.getLatestMeasurementDoc(context, rowBinding);
            if (latestDoc._updated && !latestDoc._skipped && (
                //Has a valuation code or a reading value or LAM data
                (rowBinding.IsCodeSufficient === 'X' && !!latestDoc.ValuationCode) || 
                (typeof latestDoc.ReadingValue === 'number' && !isNaN(latestDoc.ReadingValue)) || 
                !!(latestDoc.LAMObjectDatum_Nav && (latestDoc.LAMObjectDatum_Nav?.StartPoint || latestDoc.LAMObjectDatum_Nav?.EndPoint)))) {
                    if (latestDoc['@sap.isLocal'] && MeasuringPointLibrary.evalIsUpdateTransaction(context)) {
                        actionsPromises.push(updateLocalDoc(context, rowBinding, latestDoc, rowIndex));
                    } else {
                        actionsPromises.push(createNewDoc(context, rowBinding, latestDoc, newDocIndex, rowIndex));
                        newDocIndex++;
                    }
            }
        });
    });

    return Promise.all(actionsPromises)
        .then(() => {
            CommonLibrary.removeStateVariable(context, 'TransactionType');
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
        })
        .catch(error => {
            Logger.error('MeasuringPointsEDTOnCommit', error);
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
        });
}

function createNewDoc(context, sectionBinding, latestDoc, newDocIndex, rowIndex) {
    return generateNewDocNumber(context, newDocIndex).then(docNumber => {
        const docProperties = getDocProperties(context, latestDoc, sectionBinding, docNumber);

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateForChangeSet.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'MeasurementDocuments',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                },
                'Properties': docProperties,
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': docNumber,
                },
                'CreateLinks': [{
                    'Property': 'MeasuringPoint',
                    'Target':
                    {
                        'EntitySet': 'MeasuringPoints',
                        'ReadLink': sectionBinding['@odata.readLink'],
                    },
                }],
                'OnSuccess': '',
                'OnFailure': '',
                'ValidationRule': '',
            },
        }).then(actionResult => {
            if (sectionBinding.PointType === 'L' && latestDoc.LAMObjectDatum_Nav) {
                const measurementDocumentLink = JSON.parse(actionResult.data)['@odata.readLink'];
                const lamData = latestDoc.LAMObjectDatum_Nav;
                const lamProperties = getLamProperties(lamData);
                return createLAM(context, lamProperties, measurementDocumentLink, sectionBinding.Point, rowIndex);
            } else {
                return Promise.resolve();
            }
        });
    });
}

function updateLocalDoc(context, sectionBinding, localDoc, rowIndex) {
    const docProperties = getDocProperties(context, localDoc, sectionBinding);

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Measurements/MeasurementDocumentUpdate.action',
        'Properties': {
            'Target': {
                'EntitySet': 'MeasurementDocuments',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': localDoc['@odata.readLink'],
            },
            'Properties': docProperties,
            'Headers': {
                'OfflineOData.TransactionID': localDoc.MeasurementDocNum,
            },
            'OnSuccess': '',
            'OnFailure': '',
            'ValidationRule': '',
        },
    }).then(async () => {
        if (sectionBinding.PointType === 'L' && localDoc.LAMObjectDatum_Nav) {
            const lamData = localDoc.LAMObjectDatum_Nav;
            const lamProperties = getLamProperties(lamData);

            if (lamData['@odata.readLink']) {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 
                    'Properties': {
                        'Target': {
                            'EntitySet': 'LAMObjectData',
                            'ReadLink': lamData['@odata.readLink'],
                        },
                        'Properties': lamProperties,
                    },
                });
            } else {
                return createLAM(context, lamProperties, localDoc['@odata.readLink'], sectionBinding.Point, rowIndex);
            }
        } else {
            return Promise.resolve();
        }
    });
}

function createLAM(context, lamProperties, measurementDocumentLink, pointId, rowIndex) {
    return LAMMeasurementDocTableKey(context, rowIndex).then(lamKey => {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'LAMObjectData',
                },
                'Properties':  {
                    'ObjectType': 'MD',
                    'TableKey': lamKey,
                    ...lamProperties,
                },
                'CreateLinks': [
                    {
                        'Property': 'MeasuringPoint_Nav',
                        'Target':
                        {
                            'EntitySet': 'MeasuringPoints',
                            'ReadLink': `MeasuringPoints('${pointId}')`,
                        },
                    },
                    {
                        'Property': 'MeasurementDocument_Nav',
                        'Target':
                        {
                            'EntitySet': 'MeasurementDocuments',
                            'ReadLink': measurementDocumentLink,
                        },
                    },
                ],
            },
        });
    });
}

function generateNewDocNumber(context, offset) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasurementDocuments', [], '$top=1&$select=MeasurementDocNum&$filter=startswith(MeasurementDocNum, \'LOCAL_M\') eq true&$orderby=MeasurementDocNum desc').then(result => {
        const idSchema = '000000000000';
        const prefix = 'LOCAL_M';

        let id;
        if (result.length > 0) {
            id = parseInt(result.getItem(0).MeasurementDocNum.substring(prefix.length));
        } else {
            id = 0;
        }

        let newId = (id + 1 + offset).toString();
        return prefix + idSchema.substring(0, idSchema.length - newId.length) + newId;
    });
}

function getDocProperties(context, docData, sectionBinding, newDocNumber) {
    const oCurrentDate = new ODataDate(new Date());

    let properties = {
        'Point': sectionBinding.Point,
        'UOM': sectionBinding.RangeUOM,
        'ShortText': docData.ShortText,
        'ReadingDate': oCurrentDate.toDBDateString(context),
        'ReadingTime': oCurrentDate.toDBTimeString(context),
        'ReadBy': CommonLibrary.getSapUserName(context),
        'ReadingTimestamp': oCurrentDate.toDBDateTimeString(context),
        'CodeGroup': sectionBinding.CodeGroup,
        'IsCounterReading': sectionBinding.IsCounter || '',
    };
    
    if (docData.SortField) {
        properties.SortField = docData.SortField;
    }

    if (docData.OrderObjNum) {
        properties.OrderObjNum = docData.OrderObjNum;
    }

    if (docData.OperationObjNum) {
        properties.OperationObjNum = docData.OperationObjNum;
    }

    return updateProperties(docData, context, properties, newDocNumber);
}

function getLamProperties(lamData) {
    let startPoint = lamData.StartPoint ? String(lamData.StartPoint) : '';
    let endPoint = lamData.EndPoint ? String(lamData.EndPoint) : '';

    return {
        'StartMarkerDistance': lamData.StartMarkerDistance ? String(lamData.StartMarkerDistance) : '',
        'EndMarkerDistance': lamData.EndMarkerDistance ? String(lamData.EndMarkerDistance) : '',
        'Offset2Value': lamData.Offset2Value ? String(lamData.Offset2Value) : '',
        'Offset2Type': lamData.Offset2Type || '',
        'Offset2UOM': lamData.Offset2UOM || '',
        'Offset1Value': lamData.Offset1Value ? String(lamData.Offset1Value) : '',
        'Offset1Type': lamData.Offset1Type || '',
        'Offset1UOM': lamData.Offset1UOM || '',
        'LRPId': lamData.LRPId || '',
        'Length': lamData.Length ? String(lamData.Length) : '',
        'StartPoint': startPoint,
        'EndPoint': endPoint,
        'StartMarker': lamData.StartMarker ? String(lamData.StartMarker) : '',
        'EndMarker': lamData.EndMarker ? String(lamData.EndMarker) : '',
        'UOM': lamData.UOM,
        'MarkerUOM': lamData.MarkerUOM,
    };
}

function updateProperties(docData, context, prevProperties, newDocNumber) {
    const properties = { ...prevProperties };

    if (docData.ReadingValue) {
        properties.ReadingValue = docData.ReadingValue;
        properties.RecordedValue = '' + docData.ReadingValue;
        properties.HasReadingValue = 'X';

        if (properties.IsCounterReading === 'X') {
            properties.CounterReadingDifference = docData.PrevReadingValue - properties.ReadingValue || 0;
        }
    }

    addValuationCodeToProperties(properties, docData);
    addOrderObjNumToProperties(context, docData, properties);

    if (newDocNumber) {
        properties.MeasurementDocNum = newDocNumber;
    }
    return properties;
}

function addValuationCodeToProperties(properties, docData) {
    if (docData.ValuationCode) {
        if (docData.ValuationCode.includes('(')) {
            properties.ValuationCode = SplitReadLink(docData.ValuationCode).Code;
        } else {
            properties.ValuationCode = docData.ValuationCode;
        }
    } else {
        properties.ValuationCode = '';
    }
}

function addOrderObjNumToProperties(context, docData, properties) {
    let prevPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    let prevPageBinding = prevPage.binding || prevPage.getActionBinding();

    if (!docData.OrderObjNum && docData.OperationObjNum && prevPageBinding) {
        let isS4 = IsS4ServiceIntegrationEnabled(context);
        if (isS4) {
            properties.OrderObjNum = prevPageBinding.ObjectID;
        } else {
            let orderStatus = prevPageBinding.OrderMobileStatus_Nav;
            if (orderStatus) {
                properties.OrderObjNum = orderStatus.ObjectKey;
            }
        }
    }
    
    if (prevPageBinding && prevPageBinding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        properties.OrderObjNum = prevPageBinding.ObjectNumber;
    }
}
