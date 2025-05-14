import IsAndroid from '../../../Common/IsAndroid';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';
import { filterSection } from './Filters/MeasuringPointsEDTFiltersOnSuccess';
import EDTHelper from './MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTOnExtensionLoaded(context) {
    let extension = context._control;
    let sectionIndex = extension.getUserData().Index;

    updateEDTSectionValuesAfterFiltering(context, extension, sectionIndex);
    updateCachedLAMBinding(context, extension, sectionIndex);

    if (IsAndroid(context)) { 
        filterAndroidEDTSection(context, sectionIndex);
    }
}

function updateEDTSectionValuesAfterFiltering(context, extension, sectionIndex) {
    const PropertyControlNamesMap = EDTHelper.PropertyControlNamesMap;
    let sectionBindings = extension.getRowBindings();
    for (let i = 0; i < sectionBindings.length; i++) {
        let measurementDoc = EDTHelper.getLatestMeasurementDoc(context, sectionBindings[i]);
        let cachedRowBinding = EDTHelper.getCachedRowBinding(context, sectionIndex, sectionBindings[i]);
        if (cachedRowBinding) {
            let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(context, cachedRowBinding);
            updateCellValues(PropertyControlNamesMap, measurementDoc, cachedMeasurementDoc, i, extension);
        }
    }
}

function updateCellValues(PropertyControlNamesMap, measurementDoc, cachedMeasurementDoc, i, extension) {
    Object.keys(PropertyControlNamesMap).forEach(propertyName => {
        if (typeof PropertyControlNamesMap[propertyName] === 'object') {
            Object.keys(PropertyControlNamesMap[propertyName]).forEach(nestedPropertyName => {
                if (!measurementDoc[propertyName]) { 
                    measurementDoc[propertyName] = {};
                }
                
                if (cachedMeasurementDoc[propertyName] && measurementDoc[propertyName] &&
                        cachedMeasurementDoc[propertyName][nestedPropertyName] !== measurementDoc[propertyName][nestedPropertyName]) {
                    updateEDTCellValue(extension, i, PropertyControlNamesMap[propertyName][nestedPropertyName], cachedMeasurementDoc[propertyName][nestedPropertyName], cachedMeasurementDoc);
                }
            });
        }
        if (cachedMeasurementDoc[propertyName] !== measurementDoc[propertyName]) {
            updateEDTCellValue(extension, i, PropertyControlNamesMap[propertyName], cachedMeasurementDoc[propertyName], cachedMeasurementDoc);
        }
    });
}

function filterAndroidEDTSection(context, sectionIndex) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;
    if (Object.keys(filters.active).length) {
        let pageProxy = context.getPageProxy();
        let sections = pageProxy.getControls()[0].getSections();
        let headerIndex = sectionIndex + (sectionIndex + 1);
        filterSection(pageProxy, sections[headerIndex + 1], sections[headerIndex], filters.active, sectionIndex);
    }
}

function updateEDTCellValue(extension, rowIndex, cellName, value, cachedMeasurementDoc) {
    let cell = extension.getRowCellByName(rowIndex, cellName);
    if (cell) {
        cell.setValue(value);
        if (cell._cell.Type === 'ListPicker') {
            if (cell._cell.Name === 'Operation') {
                cell.setDisplayValue(cachedMeasurementDoc.OperationDisplayValue || value);
            } else {
                if (value.includes('(')) {
                    value = SplitReadLink(value)[cell._cell.Property];
                }
    
                cell.setDisplayValue(value);
            }
        }
    }
}

function updateCachedLAMBinding(context, extension, sectionIndex) {
    let cachedSectionsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings');
    let cachedSectionBindings = cachedSectionsBindings ? cachedSectionsBindings[sectionIndex] : null;

    if (cachedSectionBindings) {
        let sectionBindings = extension.getRowBindings();
        for (let i = 0; i < sectionBindings.length; i++) {
            let measurementDoc = EDTHelper.getLatestMeasurementDoc(context, sectionBindings[i]);
            let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(context, cachedSectionBindings[i]);
            
            if ((measurementDoc.LAMObjectDatum_Nav && Object.keys(measurementDoc.LAMObjectDatum_Nav).length) && !(cachedMeasurementDoc.LAMObjectDatum_Nav && Object.keys(cachedMeasurementDoc.LAMObjectDatum_Nav).length)) {
                cachedMeasurementDoc.LAMObjectDatum_Nav = Object.assign({}, measurementDoc.LAMObjectDatum_Nav);
            } else if (sectionBindings[i].LAMObjectDatum_Nav && !(cachedMeasurementDoc.LAMObjectDatum_Nav && Object.keys(cachedMeasurementDoc.LAMObjectDatum_Nav).length)) { 
                cachedMeasurementDoc.LAMObjectDatum_Nav = Object.assign({}, sectionBindings[i].LAMObjectDatum_Nav);
            }
        }
    }
}
