import CommonLibrary from '../../../Common/Library/CommonLibrary';
import MeasuringPointsEDTErrorHandler from './MeasuringPointsEDTErrorHandler';
import IsS4ServiceIntegrationEnabled from '../../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import EDTHelper from './MeasuringPointsEDTHelper';
import { validateLAM, validateReadingValue, validateShortTextExceedsLength, validateValuationCodeEntered } from './MeasuringPointsEDTOnSave';
import { updateKPI, updateSectionStatusText } from './MeasuringPointsEDTPageMetadataGenerator';

export default async function MeasuringPointsEDTOnValueChange(context) {
    let pageAPI = context.currentPage.context.clientAPI;
    let cell = context._control;
    let sectionIndex = cell.getTable().getUserData().Index;

    await cacheCellValue(pageAPI, cell, sectionIndex);
    updatePage(pageAPI, sectionIndex);
    validateCellValue(pageAPI, cell, sectionIndex);
}

export async function cacheCellValue(pageAPI, cell, sectionIndex) {
    let cachedRowBinding = EDTHelper.getCachedRowBinding(pageAPI, sectionIndex, cell.getTable().getRowBindings()[cell.getRow()]);
    
    if (cachedRowBinding) {
        let propertyName = cell._cell.Property;
        let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(pageAPI, cachedRowBinding);

        if (propertyName.includes('/')) {
            let propertiesName = propertyName.split('/');

            if (!cachedMeasurementDoc[propertiesName[0]]) {
                cachedMeasurementDoc[propertiesName[0]] = {};
            }

            cachedMeasurementDoc[propertiesName[0]][propertiesName[1]] = formatCellValue(cell);
        } else {
            if (cell._cell.Name === 'Operation') {
                cachedMeasurementDoc.OperationDisplayValue = cell.getDisplayValue();
                cachedMeasurementDoc[propertyName] = await getOperationNumber(pageAPI, cell);
            } else {
                cachedMeasurementDoc[propertyName] = formatCellValue(cell);
            }
        }
    }

    EDTHelper.updatedCachedRow(pageAPI, sectionIndex, cachedRowBinding);
}

function formatCellValue(cell) {
    if (cell._cell.Type === 'Number') {
        return Number(cell.getValue()) || 0;
    }
    
    return cell.getValue();
}

async function getOperationNumber(pageAPI, cell) {
    let operationNo = cell.getValue();
    const isS4 = IsS4ServiceIntegrationEnabled(pageAPI); 

    if (operationNo && operationNo.length > 4 && !isS4) {
        let operationLink = operationNo + '/OperationMobileStatus_Nav';
        let objectKey = await pageAPI.read('/SAPAssetManager/Services/AssetManager.service', operationLink, ['ObjectKey'], '').then(result => {
            return result.length ? result.getItem(0).ObjectKey : '';
        });
        return objectKey;
    }

    return Promise.resolve(operationNo);
}

function updatePage(pageAPI, sectionIndex) {
    let cachedSectionsBindings = CommonLibrary.getStateVariable(pageAPI, 'EDTSectionBindings');
    let { allCount, completedCount } = EDTHelper.getSectionCompletionCounts(pageAPI, cachedSectionsBindings[sectionIndex]);
    let statusText = EDTHelper.getSectionCompletionStatus(pageAPI, allCount, completedCount);
    updateSectionStatusText(pageAPI, sectionIndex, statusText);
    updateKPI(pageAPI);
}

function validateCellValue(pageAPI, cell, sectionIndex) {
    let rowIndex = cell.getRow();
    let cachedRowBinding = EDTHelper.getCachedRowBinding(pageAPI, sectionIndex, cell.getTable().getRowBindings()[rowIndex]);
    let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(pageAPI, cachedRowBinding);

    let ErrorsHandler = new MeasuringPointsEDTErrorHandler();
    ErrorsHandler.setSectionIndex(sectionIndex);
    ErrorsHandler.setRowIndex(rowIndex);

    switch (cell._cell.Property) {
        case 'ShortText': {
            validateShortTextExceedsLength(pageAPI, cachedMeasurementDoc, ErrorsHandler);
            break;
        }
        case 'ValuationCode': {
            validateValuationCodeEntered(pageAPI, cachedMeasurementDoc, cachedRowBinding, ErrorsHandler);
            break;
        }
        case 'ReadingValue': {
            validateReadingValue(pageAPI, cachedMeasurementDoc, cachedRowBinding, ErrorsHandler);
            break;
        }
        case 'LAMObjectDatum_Nav/Length':
        case 'LAMObjectDatum_Nav/Offset1Type':
        case 'LAMObjectDatum_NavOffset2Type':
        case 'LAMObjectDatum_Nav/Offset1Value':
        case 'LAMObjectDatum_Nav/Offset2Value':
        case 'LAMObjectDatum_Nav/UOM':
        case 'LAMObjectDatum_Nav/MarkerUOM': {
            validateLAM(pageAPI, cachedMeasurementDoc, ErrorsHandler);
            break;
        }
        default: break;
    }

    let sections = pageAPI.getControls()[0].getSections();

    if (ErrorsHandler.hasWarnings()) {
        ErrorsHandler.showWarnings(sections, pageAPI);
    } else {
        let edtSectionIndex = (sectionIndex + 1) * 2;
        ErrorsHandler.hideWarningForCell(sections[edtSectionIndex], rowIndex, cell._cell.Name);
    }
    
    if (ErrorsHandler.hasErrors()) {
        ErrorsHandler.showErrors(sections);
    } else {
        let edtSectionIndex = (sectionIndex + 1) * 2;
        ErrorsHandler.hideErrorForCell(sections[edtSectionIndex], rowIndex, cell._cell.Name);
    }
}
