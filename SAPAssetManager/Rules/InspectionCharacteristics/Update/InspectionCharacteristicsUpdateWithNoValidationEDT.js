import inspCharLib from './InspectionCharacteristics';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import libVal from '../../Common/Library/ValidationLibrary';
import { InspectionValuationVar} from '../../Common/Library/GlobalInspectionResults';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function InspectionCharacteristicsUpdateWithNoValidationEDT(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    if (sections && sections.length > 0) {
        const promises = [];
        for (let section of sections) {
            if (section.getExtension() && section.getExtension().constructor && section.getExtension().constructor.name === 'EditableDataTableViewExtension') {
                let extension = section.getExtension();
                if (extension) {
                    let valuations = InspectionValuationVar.getInspectionResultValuations();
                    let rows = extension.getUpdatedValues();
                    for (let row of rows) {
                        let quantitativeAction = '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeUpdate.action';
                        let qualitativeAction = '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeUpdate.action';
                        let valuation = '';
                        let remarks = '';
                        if (Object.prototype.hasOwnProperty.call(row.Properties, 'Valuation')) {
                            valuation = valuations[row.Properties.Valuation];
                        }
                        if (Object.prototype.hasOwnProperty.call(row.Properties, 'Remarks')) {
                            remarks = row.Properties.Remarks;
                        }
                        if (((inspCharLib.isQuantitative(row.OdataBinding) || inspCharLib.isCalculatedAndQuantitative(row.OdataBinding))) && row.Properties.ResultValue) {
                            const properties = {
                                'Target': {
                                    'EntitySet': 'InspectionCharacteristics',
                                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                                    'ReadLink': row.OdataBinding['@odata.readLink'],
                                },
                                'Headers':
                                {
                                    'OfflineOData.TransactionID': row.OdataBinding.InspectionLot_Nav.InspectionLot,
                                },
                                'Properties': {
                                    'ResultValue': row.Properties.ResultValue,
                                    'Valuation': valuation,
                                    'Remarks': remarks,
                                },
                                'UpdateLinks':
                                [{
                                    'Property': 'InspValuation_Nav',
                                    'Target': {
                                        'EntitySet': 'InspectionResultValuations',
                                        'ReadLink': `InspectionResultValuations('${valuation}')`,
                                    },
                                }],
                                'ValidationRule': '',
                            };
                            promises.push(context.executeAction({
                                'Name': quantitativeAction,
                                'Properties': properties,
                            }));
                        } else if (inspCharLib.isQualitative(row.OdataBinding) && row.Properties.Code) {
                            let CodeGroup = '';
                            let Code = '';
                            let Catalog = '';
                            if (Object.prototype.hasOwnProperty.call(row.Properties, 'Code')) {
                                CodeGroup = SplitReadLink(row.Properties.Code).CodeGroup;
                                Code = SplitReadLink(row.Properties.Code).Code;
                                Catalog = SplitReadLink(row.Properties.Code).Catalog;
                                let createLinks = [];
                                if (libVal.evalIsEmpty(row.OdataBinding.InspValuation_Nav) && !libVal.evalIsEmpty(row.Properties.Valuation)) {
                                    createLinks.push({
                                        'Property': 'InspValuation_Nav',
                                        'Target':
                                        {
                                            'EntitySet': 'InspectionResultValuations',
                                            'ReadLink': `InspectionResultValuations('${valuation}')`,
                                        },
                                    });
                                }
                                if (libVal.evalIsEmpty(row.OdataBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(row.Properties.Code)) {
                                    createLinks.push({
                                        'Property': 'InspectionCode_Nav',
                                        'Target':
                                        {
                                            'EntitySet': 'InspectionCodes',
                                            'ReadLink': row.Properties.Code,
                                        },
                                    });
                                }
                                let updateLinks = [];
                                if (!libVal.evalIsEmpty(row.OdataBinding.InspValuation_Nav) && !libVal.evalIsEmpty(row.Properties.Valuation)) {
                                    updateLinks.push({
                                        'Property': 'InspValuation_Nav',
                                        'Target':
                                        {
                                            'EntitySet': 'InspectionResultValuations',
                                            'ReadLink': `InspectionResultValuations('${valuation}')`,
                                        },
                                    });
                                }
                                if (!libVal.evalIsEmpty(row.OdataBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(row.Properties.Code)) {
                                    updateLinks.push({
                                        'Property': 'InspectionCode_Nav',
                                        'Target':
                                        {
                                            'EntitySet': 'InspectionCodes',
                                            'ReadLink': row.Properties.Code,
                                        },
                                    });
                                }
                                const properties = {
                                    'Target': {
                                        'EntitySet': 'InspectionCharacteristics',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'ReadLink': row.OdataBinding['@odata.readLink'],
                                    },
                                    'Headers':
                                    {
                                        'OfflineOData.TransactionID': row.OdataBinding.InspectionLot_Nav.InspectionLot,
                                    },
                                    'Properties': {
                                        'CodeGroup': CodeGroup,
                                        'Valuation': valuation,
                                        'Code': Code,
                                        'Catalog': Catalog,
                                        'Remarks': remarks,
                                    },
                                    'CreateLinks': createLinks,
                                    'UpdateLinks': updateLinks,
                                    'ValidationRule': '',
                                };
                                promises.push(context.executeAction({
                                    'Name': qualitativeAction,
                                    'Properties': properties,
                                }));
                            }
                        }
                    }
                }
            }
        }
        if (promises.length > 0) {
            await Promise.all(promises);
        }
    }
}
