import CommonLibrary from '../../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';
import Logger from '../../../Log/Logger';

export default class EDTHelper {

    static getSectionCompletionCounts(context, points) {
        return {
            allCount: points.length,
            completedCount: EDTHelper.countCompletedMeasuringPoints(context, points),
        };
    }

    static getSectionCompletionStatus(context, allCount, completedCount) {
        let statusText;

        if (allCount !== completedCount) {
            statusText = context.localizeText('incomplete') + ` (${completedCount}/${allCount})`;
        } else {
            statusText = context.localizeText('kpi_completed');
        }

        return statusText;
    }

    static countCompletedMeasuringPoints(context, points) {
        let count = 0;

        if (points && points.length) {
            points.forEach(point => {
                count += EDTHelper.isMeasuringPointCompleted(context, point) ? 1 : 0;
            });
        }

        return count;
    }

    static isMeasuringPointCompleted(context, point) {
        let isCompleted = false;

        if (point && point.MeasurementDocs && point.MeasurementDocs.length) {
            const orderObjNum = EDTHelper.getOrderObjectNumberFromContext(context);
            if (orderObjNum) {
                isCompleted = point.MeasurementDocs.some(document => {
                    return document.OrderObjNum === orderObjNum;
                });
            } else {
                let latestDoc = EDTHelper.getLatestMeasurementDoc(context, point);

                const isReadingValidationNeeded = EDTHelper.isReadingValueMandatory(point, latestDoc);
                if (isReadingValidationNeeded) {
                    isCompleted = !!latestDoc.ReadingValue;
                } else {
                    isCompleted = !!latestDoc.ValuationCode;
                }
            }
        }

        return isCompleted;
    }

    static getLatestMeasurementDoc(context, point) {
        let latestDoc;
        let measurementDocs = point.MeasurementDocs;

        if (measurementDocs && measurementDocs.length) {
            const docId = CommonLibrary.getStateVariable(context, 'EDTSectionDocumentId');
            if (docId) {
                latestDoc = measurementDocs.find(doc => doc.MeasurementDocNum === docId);
            } else {
                latestDoc = measurementDocs[0];

                measurementDocs.forEach(doc => {
                    if (latestDoc && latestDoc.ReadingTimestamp < doc.ReadingTimestamp) {
                        latestDoc = doc;
                    }
                });
            }
        }

        return latestDoc || EDTHelper.createMeasurementDoc(point);
    }

    static createMeasurementDoc(rowBinding) {
        let newDoc = {
            ReadingValue: undefined,
            PrevReadingValue: undefined,
            ReadingTimestamp: new Date().getTime(),
            _created: true,
            _error: false,
            _updated: false,
            _skipped: false,
            LAMObjectDatum_Nav: rowBinding.PointType === 'L' ? {} : null,
            ShortText: '',
        };
        return newDoc;
    }

    static getLatestLocalMeasurementDoc(context, measurementDocs) {
        let latestDoc;

        if (measurementDocs && measurementDocs.length) {
            let localMeasurementDocs = measurementDocs.filter(doc => doc['@sap.isLocal']);
            latestDoc = EDTHelper.getLatestMeasurementDoc(context, {'MeasurementDocs': localMeasurementDocs});
        }

        return latestDoc || {};
    }

    static isOperationColumnVisible(context, points, config) {
        try {
            const pageProxy = context.getPageProxy();
            const actionBinding = pageProxy.getActionBinding && pageProxy.getActionBinding();
            // hides Operation column when Take Readings were called from an operation card
            if (actionBinding?.['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                return false;
            }
        } catch (error) {
            Logger.error('isOperationColumnVisible', error);
        }

        let isVisible = false;

        if (points && points.length && config && config.operations) {
            let combinedPointIds = config.operations.map(operation => {
                return operation.PointIds;
            }).flat();

            isVisible = points.some(point => {
                return combinedPointIds.includes(point.Point);
            });
        }

        return isVisible;
    }

    static isValuationCodeColumnVisible(points) {
        let isVisible = false;

        if (points && points.length) {
            isVisible = points.some(point => {
                return point.CodeGroup;
            });
        }

        return isVisible;
    }

    static isLamColumnsVisible(points) {
        let isVisible = false;

        if (points && points.length) {
            isVisible = points.some(point => {
                return point.PointType === 'L';
            });
        }

        return isVisible;
    }


    static isReadingValueMandatory(point, latestDoc) {
        let isMandatory = true;

        if (point.CodeGroup) {
            if (point.CharName) {
                if (point.IsCodeSufficient === 'X' && !latestDoc.ReadingValue) {
                    isMandatory = false;
                }
            } else {
                isMandatory = false;
            }
        }

        return isMandatory;
    }

    static getLAMNumericControlParameters(context, measurementDocs, propertyName) {
        let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, measurementDocs);
        let lam = latestDoc.LAMObjectDatum_Nav;
        let value = EDTHelper.getLAMPropertyValue(context, lam, propertyName, true);
        let parameters = value ? {'Value' : value} : {};

        return parameters;
    }

    static getParentPointLAMNumericControlParameters(context, propertyName) {
        let lam = context.binding.LAMObjectDatum_Nav;
        let value = EDTHelper.getLAMPropertyValue(context, lam, propertyName, true);
        let parameters = value ? {'Value' : value} : {};

        return parameters;
    }

    static getLAMPropertyValue(context, lamObjectData, propertyName, isNumeric = false) {
        let value;
        
        if (lamObjectData && lamObjectData[propertyName] !== undefined) {
            if (isNumeric) {
                value = LocalizationLibrary.toNumber(context, lamObjectData[propertyName]);
            } else {
                value = lamObjectData[propertyName];
            }
        }

        return value;
    }

    static getCachedRowBinding(context, sectionIndex, rowBinding) {
        let cachedSectionsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings');
        let cachedSectionBindings = cachedSectionsBindings ? cachedSectionsBindings[sectionIndex] : null;

        if (cachedSectionBindings) {
            let cachedRowBinding = cachedSectionBindings.find(cachedBinding => cachedBinding.Point === rowBinding.Point);

            if (cachedRowBinding) {
                let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(context, cachedRowBinding);
                if (cachedMeasurementDoc._created) {
                    cachedMeasurementDoc._created = false;
                    cachedRowBinding.MeasurementDocs.push(cachedMeasurementDoc);
                }
            }

            return cachedRowBinding;
        }

        return null;
    }

    static updatedCachedRow(context, sectionIndex, cachedRowBinding) {
        if (!cachedRowBinding) return;

        let cachedSectionsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings');
        let cachedSectionBindings = cachedSectionsBindings ? cachedSectionsBindings[sectionIndex] : null;

        if (cachedSectionBindings) {
            let cachedRowBindingIndex = cachedSectionBindings.findIndex(cachedBinding => cachedBinding.Point === cachedRowBinding.Point);
            cachedSectionBindings[cachedRowBindingIndex] = cachedRowBinding;
        } 
    }

    static getOrderObjectNumberFromContext(context) {
        const binding = context.binding || (context.getActionBinding && context.getActionBinding()) || {};
        return binding.ObjectKey || binding.OrderMobileStatus_Nav?.ObjectKey || '';
    }
}

EDTHelper.PropertyControlNamesMap = {
    //property name : control name
    'ReadingValue': 'ReadingValue',
    'ShortText': 'ShortTextNote',
    'OperationObjNum': 'Operation',
    'ValuationCode': 'ValuationCode',
    'LAMObjectDatum_Nav': {
        'StartPoint': 'StartPoint',
        'EndPoint': 'EndPoint',
        'Length': 'Length',
        'UOM': 'UOM',
        'StartMarker': 'StartMarker',
        'StartMarkerDistance': 'StartMarkerDistance',
        'EndMarker': 'EndMarker',
        'EndMarkerDistance': 'EndMarkerDistance',
        'MarkerUOM': 'MarkerUOM',
        'Offset1Type': 'Offset1Type',
        'Offset1Value': 'Offset1',
        'Offset1UOM': 'Offset1UOM',
        'Offset2Type': 'Offset2Type',
        'Offset2Value': 'Offset2',
        'Offset2UOM': 'Offset2UOM',
    },
};
