import { FDCFilterable, FDCSectionHelper } from '../FDC/DynamicPageGenerator';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
* Sets up Measuring Points Data Entry Page
* @param {IClientAPI} context
*/
export default function MeasuringPointsDataEntryOnLoaded(context) {
	// Set up Filterable object for the filter control
	let filterable = new FDCFilterable(context);
	context.getClientData().Filterable = filterable;

	let sectionHelper = new FDCSectionHelper(context);

	// Check for existing measurement document and pre-fill fields
	sectionHelper.run(async (sectionBinding, section) => {
		/** @type {MeasurementDocument} */
		const measurementDoc = await context.read('/SAPAssetManager/Services/AssetManager.service', `${sectionBinding['@odata.readLink']}/MeasurementDocs`, [], '$filter=sap.islocal()&$orderby=ReadingTimestamp desc').then(docs => {
			if (docs.length > 0) {
				return docs.getItem(0);
			} else {
				return null;
			}
		});

		if (measurementDoc) {
			section.getControl('ReadingSim').setValue(measurementDoc.ReadingValue);
			section.getControl('ShortTextNote').setValue(measurementDoc.ShortText);

			if (measurementDoc.OperationObjNum) {
				let isS4 = IsS4ServiceIntegrationEnabled(context);
				let value = isS4 ? measurementDoc.OperationObjNum : await context.read('/SAPAssetManager/Services/AssetManager.service', `PMMobileStatuses('${measurementDoc.OperationObjNum}')`, [], '$expand=WOOperation_Nav').then(result => {
					if (result.length > 0) {
						return result.getItem(0).WOOperation_Nav.OperationNo;
					} else {
						return '';
					}
				});
				section.getControl('OperationSimPicker').setValue(value);
			}
			
			// To avoid errors, only set Valuation Code List PIcker if ValuationCode is set (return value must be a readlink)
			if (measurementDoc.ValuationCode)
				section.getControl('ValuationCodeLstPkr').setValue(`PMCatalogCodes(Catalog='${sectionBinding.CatalogType}',CodeGroup='${sectionBinding.CodeGroup}',Code='${measurementDoc.ValuationCode}')`);
			// LAM point -- pre-fill more fields
			if (sectionBinding.PointType === 'L') {
				const lamObjectDatum = await context.read('/SAPAssetManager/Services/AssetManager.service', `${measurementDoc['@odata.readLink']}`, [], '$expand=LAMObjectDatum_Nav').then(doc => {
					if (doc.length > 0) {
						return doc.getItem(0).LAMObjectDatum_Nav;
					} else {
						return null;
					}
				});
				const LAMObjectDatumFieldNames2Values = !lamObjectDatum ? [] : [
					['LRPLstPkr', lamObjectDatum.LRPId],
					['StartPoint', lamObjectDatum.StartPoint],
					['EndPoint', lamObjectDatum.EndPoint],
					['Length', lamObjectDatum.Length],
					['UOMLstPkr', lamObjectDatum.UOM],
					['StartMarkerLstPkr', lamObjectDatum.StartMarker],
					['DistanceFromStart', lamObjectDatum.StartMarkerDistance],
					['EndMarkerLstPkr', lamObjectDatum.EndMarker],
					['DistanceFromEnd', lamObjectDatum.EndMarkerDistance],
					['MarkerUOMLstPkr', lamObjectDatum.MarkerUOM],
					['Offset1TypeLstPkr', lamObjectDatum.Offset1Type],
					['Offset1', lamObjectDatum.Offset1Value],
					['Offset1UOMLstPkr', lamObjectDatum.Offset1UOM],
					['Offset2TypeLstPkr', lamObjectDatum.Offset2Type],
					['Offset2', lamObjectDatum.Offset2Value],
					['Offset2UOMLstPkr', lamObjectDatum.Offset2UOM],
				];
				[
					...LAMObjectDatumFieldNames2Values,
					['ReadingSim', measurementDoc.ReadingValue],
					['ReadingSim', measurementDoc.RecordedValue],
					['ShortTextNote', measurementDoc.ShortText],
				].forEach(([fieldName, val]) => section.getControl(fieldName).setValue(val));
			}
		}
	});
	// Check for non local measurement document and pre-fill previous reading
	sectionHelper.run(async (sectionBinding, section) => {
		const measurementDoc = await context.read('/SAPAssetManager/Services/AssetManager.service', `${sectionBinding['@odata.readLink']}/MeasurementDocs`, ['ReadingValue', 'ValuationCode'], '$filter=not sap.islocal()&$orderby=ReadingTimestamp desc&$top=1').then(docs => {
			if (docs.length > 0) {
				return docs.getItem(0);
			} else {
				return null;
			}
		});
		
		if (measurementDoc.ValuationCode) {
			section.getControl('PreviousValuationCodeLstPkr').setValue(`PMCatalogCodes(Catalog='${sectionBinding.CatalogType}',CodeGroup='${sectionBinding.CodeGroup}',Code='${measurementDoc.ValuationCode}')`);
			section.getControl('PreviousValuationCodeLstPkr').setVisible(true);
			section.getControl('PreviousValuationCodeLstPkr').setEditable(false);

		} else if (measurementDoc) {
			section.getControl('PreviousReading').setValue(measurementDoc.ReadingValue);
			section.getControl('PreviousReading').setVisible(true);
		}

	});
}
