import { FDCSectionHelper } from '../../FDC/DynamicPageGenerator';
import ODataDate from '../../Common/Date/ODataDate';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import MeasuringPointLibrary from '../MeasuringPointLibrary';
import { SetStartPointEndPointLength } from '../../LAM/CreateUpdate/LAMCreateUpdateCalculateLengthStartEndPoint';
import prevReadingQuery from './MeasurementDocumentPreviousReadingQuery';
import LAMMeasurementDocTableKey from '../../LAM/CreateUpdate/LAMMeasurementDocTableKey';

function PadNumber(value, padString, prefix = '') {
    let valueStr = value.toString();
    return prefix + padString.substring(0, padString.length - valueStr.length) + valueStr;
}


export default function MeasurementDocumentsCreateChangeSet(context) {

    let fdcHelper = new FDCSectionHelper(context);
    let missingCount = 0;
    common.setStateVariable(context, 'MissingCount', missingCount);

    // Validate all sections first
    return fdcHelper.run(async (sectionBinding, section) => {
        // Build a dictionary of all controls (possibly) requiring input
        // Dictionary should be in format {'ControlName' : Object<IControlProxy>}
        let inputControls = [
            'ReadingSim',
            'ShortTextNote',
            'ValuationCodeLstPkr',
            'LRPLstPkr',
            'StartPoint',
            'EndPoint',
            'Length',
            'UOMLstPkr',
            'MarkerUOMLstPkr',
            'Offset1TypeLstPkr',
            'Offset1',
            'Offset1UOMLstPkr',
            'Offset2TypeLstPkr',
            'Offset2',
            'Offset2UOMLstPkr',
            'DistanceFromEnd',
            'DistanceFromStart',
            'StartMarkerLstPkr',
            'EndMarkerLstPkr',
        ].map(controlStr => [controlStr, section.getControl(controlStr)]);
        /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead 
        let controlDict = Array.from(inputControls).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});

        const [startVal, endVal] = [controlDict.StartPoint, controlDict.EndPoint].map(i => i.getValue());
        if (startVal && endVal) {
            await SetStartPointEndPointLength(startVal, endVal, controlDict.Length, controlDict.Length);
        }

        // Reset validation
        for (let ctrl in controlDict) {
            // Don't do anything if controlDict[ctr] is for some reason undefined
            if (controlDict[ctrl])
                common.setInlineControlErrorVisibility(controlDict[ctrl], false);
        }
        section.getControl('ValuationCodeLstPkr').clearValidation();

        let skip = section.getControl('SkipValue').getValue();
        if (skip) {
            return true;
        } else {
            let previousReadingPromise = getPreviousReadingPromise(sectionBinding, context);
        
            return previousReadingPromise.then((previousReading) => {
                if (previousReading && previousReading.length > 0) {
                    sectionBinding.previousReadingObj = previousReading.getItem(0);
                }
                return MeasuringPointLibrary.measurementDocumentCreateUpdateValidation(context, false, sectionBinding, controlDict);
            });
        }
    }).then(validationPass => {
        if (validationPass.every(value => value === true)) {
            //check for missing readings
            let count = common.getStateVariable(context, 'MissingCount');
            if (count > 0) {
                let messageText = context.localizeText('validation_missed_readings_x', [count]);
                let okButtonText = context.localizeText('continue_text');
                let cancelButtonText = context.localizeText('cancel');

                return common.showWarningDialog(context, messageText, undefined, okButtonText, cancelButtonText).then(() => {
                    return recordReadings(context);
                });
            }

            // If validation is successful, run measuring point creates
            return recordReadings(context);
        } else {
            return Promise.resolve();
        }
    });
}

function getPreviousReadingPromise(sectionBinding, context) {
    if (sectionBinding['@odata.type'] === '#sap_mobile.MeasuringPoint') {
        return MeasuringPointLibrary.getLatestNonLocalReading(context, sectionBinding, prevReadingQuery(context, sectionBinding));
    } else {
        // If MeasuringPoint is undefined, assume we're on a PRT Point
        if (!sectionBinding.MeasuringPoint) {
            return MeasuringPointLibrary.getLatestNonLocalReading(context, sectionBinding.PRTPoint, prevReadingQuery(context, sectionBinding));
        } else {
            return MeasuringPointLibrary.getLatestNonLocalReading(context, sectionBinding.MeasuringPoint, prevReadingQuery(context, sectionBinding));
        }
    }
}

function recordReadings(context) {
    let fdcHelper = new FDCSectionHelper(context);
    return fdcHelper.run(async (sectionBinding, section) => {
        /*
         * Helper function: get picker value. Declared here so `section` gets inherited from upper scope
         */
        let getPickerValue = function(pickerName) {
            try {
                return section.getControl(pickerName).getValue()[0].ReturnValue;
            } catch (exc) {
                return '';
            }
        };

        if (sectionBinding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
            sectionBinding = sectionBinding.PRTPoint;
        } 
        // Get control values and various constants
        const odataDate = new ODataDate(new Date());
        const reading = section.getControl('ReadingSim').getValue();
        const shortText = section.getControl('ShortTextNote')?.getValue();
        const valuationCode = (function() {
            let rawValue = section.getControl('ValuationCodeLstPkr').getValue();
            if (rawValue.length > 0) {
                let selectedValue = rawValue[0].ReturnValue;
                return SplitReadLink(selectedValue).Code;
            } else {
                return '';
            }
        })();
        const codeShortText = (function() {
            try {
                let valuationCodeListPickerValue = section.getControl('ValuationCodeLstPkr').getValue();
                let codeDescription = valuationCodeListPickerValue[0]?.DisplayValue.split('-').toString().split(',')[1].trim();
                return codeDescription;
            } catch (exception) {
                return '';
            }
        })();
        const docNum = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasurementDocuments', [], "$top=1&$select=MeasurementDocNum&$filter=startswith(MeasurementDocNum, 'LOCAL_M') eq true&$orderby=MeasurementDocNum desc").then(result => {
            const prefix = 'LOCAL_M';
            if (result.length > 0) {
                let newID = parseInt(result.getItem(0).MeasurementDocNum.substring(prefix.length));
                return PadNumber(newID + 1, '000000000000', prefix);
            } else {
                return 'LOCAL_M000000000001';
            }
        });
        // Create Measurement Document if reading is provided
        if (reading || valuationCode) {
            /** @type {MeasurementDocument} properties */
            let properties = {
                'MeasurementDocNum': docNum,
                'Point': sectionBinding.Point,
                'ShortText': shortText || '',
                'ReadingDate': odataDate.toDBDateString(context),
                'ReadingTime': odataDate.toDBTimeString(context),
                'ReadBy': common.getSapUserName(context),
                'ReadingTimestamp': odataDate.toDBDateTimeString(context),
                'UOM': sectionBinding.RangeUOM,
                'PointObjectKey': '',
                'SortField': docNum,
                'OrderObjNum': (() => {
                    const clientData = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData();
                    try {
                        const point = Object.prototype.hasOwnProperty.call(context.binding,'Point') ? context.binding.Point : sectionBinding.Point;
                        const pointData = clientData.MeasuringPointData[point];

                        if (common.isDefined(pointData.OrderId)) {
                            return pointData.OrderId;
                        } else if (common.isDefined(pointData.NotificationNumber)) {
                            return pointData.NotificationNumber;
                        } else {
                            return context.binding.OrderMobileStatus_Nav.ObjectKey;
                        }
                    } catch (exc) {
                        if (context.binding.WOOperation_Nav && context.binding.WOOperation_Nav.WOHeader && context.binding.WOOperation_Nav.WOHeader.ObjectKey) { //PRT from operations
                            return context.binding.WOOperation_Nav.WOHeader.ObjectKey;
                        }
                        return '';
                    }
                })(),
                'OperationObjNum': (() => {
                    const clientData = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData();
                    try {
                        if (Object.prototype.hasOwnProperty.call(context.binding, 'Point')) {
                            return common.isDefined(clientData.MeasuringPointData[context.binding.Point].Operation) ? clientData.MeasuringPointData[sectionBinding.Point].Operation : '';
                        } else if (common.isDefined(sectionBinding.MeasuringPoint)) {
                            return common.isDefined(clientData.MeasuringPointData[sectionBinding.MeasuringPoint.Point].Operation) ? clientData.MeasuringPointData[sectionBinding.MeasuringPoint.Point].Operation : '';
                        } else {
                            return common.isDefined(clientData.MeasuringPointData[sectionBinding.Point].Operation) ? clientData.MeasuringPointData[sectionBinding.Point].Operation : '';
                        }
                    } catch (exc) {
                        if (context.binding.WOOperation_Nav && context.binding.WOOperation_Nav.ObjectKey) { //PRT from operations
                            return context.binding.WOOperation_Nav.ObjectKey;
                        }
                        return '';
                    }
                })(),
            };

            if (reading) {
                properties.ReadingValue = reading;
                properties.RecordedValue = `${reading}`;  // sometimes this is number type, should be string
                properties.HasReadingValue = 'X';
            }
            if (valuationCode) {
                properties.CodeGroup = sectionBinding.CodeGroup;
                properties.ValuationCode = valuationCode;
                properties.CodeShortText = codeShortText;
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${sectionBinding['@odata.readLink']}/MeasurementDocs`, [], '$filter=sap.islocal()&$orderby=ReadingTimestamp desc').then(docs => {
                if (docs.length > 0) {
                    return docs.getItem(0);
                } else {
                    return null;
                }
            }).then(localDocument => {
                if (localDocument === null) { // If there is no local measurement document to update, create one
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateForChangeSet.action', 'Properties': {
                            'Target': {
                                'EntitySet': 'MeasurementDocuments',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                            },
                            'Properties': properties,
                            'Headers': {
                                'OfflineOData.RemoveAfterUpload': 'true',
                                'OfflineOData.TransactionID': docNum,
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
                    }).then(async actionResult => {
                        const measurementDocumentData = JSON.parse(actionResult.data);
                        // If this is a LAM point, Create LAM data
                        if (sectionBinding.PointType === 'L') {
                            const tableKey = await LAMMeasurementDocTableKey(context);
                            /** @type {LAMObjectDatum} */
                            let LAMProperties = {
                                'StartMarkerDistance': section.getControl('DistanceFromStart').getValue() || '',
                                'EndMarkerDistance': section.getControl('DistanceFromEnd').getValue() || '',
                                'Offset2Value': section.getControl('Offset2').getValue() || '',
                                'Offset2Type': getPickerValue('Offset2TypeLstPkr'),
                                'Offset2UOM': getPickerValue('Offset2UOMLstPkr'),
                                'Offset1Value': section.getControl('Offset1').getValue() || '',
                                'Offset1Type': getPickerValue('Offset1TypeLstPkr'),
                                'Offset1UOM': getPickerValue('Offset1UOMLstPkr'),
                                'LRPId': section.getControl('LRPLstPkr').getValue() || '',
                                'Length': section.getControl('Length').getValue() || '',
                                'StartPoint': section.getControl('StartPoint').getValue() || '',
                                'EndPoint': section.getControl('EndPoint').getValue() || '',
                                'StartMarker': getPickerValue('StartMarkerLstPkr'),
                                'EndMarker': getPickerValue('EndMarkerLstPkr'),
                                'UOM': getPickerValue('UOMLstPkr'),
                                'MarkerUOM': getPickerValue('MarkerUOMLstPkr'),
                                'ObjectType': 'MD',
                                'TableKey': tableKey,
                            };
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 'Properties': {
                                    'Target': {
                                        'EntitySet': 'LAMObjectData',
                                    },
                                    'Properties': LAMProperties,
                                    'Headers': {
                                        'OfflineOData.TransactionID': tableKey + 'MD',
                                    },
                                    'CreateLinks':
                                        [{
                                            'Property': 'MeasuringPoint_Nav',
                                            'Target':
                                            {
                                                'EntitySet': 'MeasuringPoints',
                                                'ReadLink': `MeasuringPoints('${sectionBinding.Point}')`,
                                            },
                                        },
                                        {
                                            'Property': 'MeasurementDocument_Nav',
                                            'Target':
                                            {
                                                'EntitySet': 'MeasurementDocuments',
                                                'ReadLink': measurementDocumentData['@odata.readLink'],
                                            },
                                        }],
                                },
                            });
                        } else {
                            return Promise.resolve();
                        }
                    });
                } else { // If a local measurement document exists, update it
                    delete properties.MeasurementDocNum; // Remove key property so update doesn't fail
                    properties.SortField = localDocument.MeasurementDocNum; // SortField is set to a generated document ID above. Change this to the known ID
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/Measurements/MeasurementDocumentUpdate.action', 'Properties': {
                            'Target': {
                                'EntitySet': 'MeasurementDocuments',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': localDocument['@odata.readLink'],
                            },
                            'Properties': properties,
                            'Headers': {
                                'OfflineOData.TransactionID': localDocument.MeasurementDocNum,
                            },
                            'OnSuccess': '',
                            'OnFailure': '',
                            'ValidationRule': '',
                        },
                    }).then(async () => {
                        // If this is a LAM point, Create LAM data
                        if (sectionBinding.PointType === 'L') {
                            let lamObject = await context.read('/SAPAssetManager/Services/AssetManager.service', `${localDocument['@odata.readLink']}/LAMObjectDatum_Nav`, [], '').then(result => result.getItem(0));
                            /** @type {LAMObjectDatum} */
                            let LAMProperties = {
                                'StartMarkerDistance': section.getControl('DistanceFromStart').getValue() || '',
                                'EndMarkerDistance': section.getControl('DistanceFromEnd').getValue() || '',
                                'Offset2Value': section.getControl('Offset2').getValue() || '',
                                'Offset2Type': getPickerValue('Offset2Type'),
                                'Offset2UOM': getPickerValue('Offset2UOMLstPkr'),
                                'Offset1Value': section.getControl('Offset1').getValue() || '',
                                'Offset1Type': getPickerValue('Offset1TypeLstPkr'),
                                'Offset1UOM': getPickerValue('Offset1UOMLstPkr'),
                                'LRPId': section.getControl('LRPLstPkr').getValue() || '',
                                'Length': section.getControl('Length').getValue() || '',
                                'StartPoint': section.getControl('StartPoint').getValue() || '',
                                'EndPoint': section.getControl('EndPoint').getValue() || '',
                                'StartMarker': getPickerValue('StartMarkerLstPkr'),
                                'EndMarker': getPickerValue('EndMarkerLstPkr'),
                                'UOM': getPickerValue('UOMLstPkr'),
                                'MarkerUOM': getPickerValue('MarkerUOMLstPkr'),
                            };
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
                                    'Target': {
                                        'EntitySet': 'LAMObjectData',
                                        'ReadLink': lamObject['@odata.readLink'],
                                    },
                                    'Properties': LAMProperties,
                                },
                            });
                        } else {
                            return Promise.resolve();
                        }
                    });
                }
            });
        } else {
            return Promise.resolve();
        }
    }).then(() => context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'));
}
